import { AppDispatch } from "@/store";
import {
  processStreamingPacket,
  setError,
  setThreadId,
  completeStreamingMessage,
  clearLastFailedRequest,
} from "@/store/slices/messages/messagesSlice";
import { ReceivePacket, SendPacket } from "@/chat/api/types";

const TIMEOUT_CHECKER_INTERVAL = 1500;
const MAX_INTERVAL_BETWEEN_MESSAGES = 300000;

type StartChatStreamParams = {
  url: string;
  token: string;
  packet: SendPacket;
  messageId: string;
  dispatch: AppDispatch;
  signal: AbortSignal;
};

export async function startChatStream({
  url,
  token,
  packet,
  messageId,
  dispatch,
  signal,
}: StartChatStreamParams): Promise<void> {
  let buffer = "";
  const decoder = new TextDecoder();
  let threadIdReceived = false;
  let allMessagesReceived = false;
  let lastMessageTs: number | null = null;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let stopped = false;

  const stop = () => {
    stopped = true;
    reader?.cancel();
  };

  const handleError = () => {
    dispatch(setError());
    stop();
  };

  const handlePacket = (p: ReceivePacket) => {
    lastMessageTs = Date.now();

    if (p.type === "error") {
      handleError();
      return;
    }

    if (p.type === "finished") {
      allMessagesReceived = true;
      dispatch(completeStreamingMessage({ messageId }));
      dispatch(clearLastFailedRequest());
      stop();
      return;
    }

    dispatch(processStreamingPacket({ messageId, packet: p }));

    if ("chat_id" in p && !threadIdReceived) {
      dispatch(setThreadId(p.chat_id));
      threadIdReceived = true;
    }
  };

  // Extracts complete newline-delimited JSON lines from buffer and dispatches each as a packet
  const processBuffer = () => {
    const idx = buffer.lastIndexOf("\n");
    if (idx === -1) return;
    const complete = buffer.substring(0, idx);
    buffer = buffer.substring(idx + 1);
    for (const line of complete.split("\n")) {
      if (!line.trim() || stopped) break;
      try {
        handlePacket(JSON.parse(line));
      } catch {
        handleError();
      }
    }
  };

  signal.addEventListener("abort", stop, { once: true });

  let timeoutChecker: ReturnType<typeof setInterval> | null = null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packet),
      signal,
    });

    if (!res.ok) throw new Error("Unable to connect to AI backend.");
    if (!res.body) return;

    reader = res.body.getReader();

    timeoutChecker = setInterval(() => {
      if (allMessagesReceived || stopped) {
        clearInterval(timeoutChecker!);
        return;
      }
      if (lastMessageTs && Date.now() - lastMessageTs > MAX_INTERVAL_BETWEEN_MESSAGES) {
        clearInterval(timeoutChecker!);
        handleError();
      }
    }, TIMEOUT_CHECKER_INTERVAL);

    // Reads the response stream chunk by chunk; flushes remaining buffer on close
    let result = await reader.read();
    while (!result.done && !stopped) {
      buffer += decoder.decode(result.value, { stream: true });
      processBuffer();
      if (stopped) break;
      result = await reader.read();
    }

    if (!stopped && buffer.trim()) {
      try {
        handlePacket(JSON.parse(buffer));
      } catch {
        handleError();
      }
    }

    if (!stopped && !allMessagesReceived) handleError();
  } catch (err: any) {
    if (err?.name !== "AbortError") dispatch(setError());
  } finally {
    if (timeoutChecker) clearInterval(timeoutChecker);
    signal.removeEventListener("abort", stop);
  }
}
