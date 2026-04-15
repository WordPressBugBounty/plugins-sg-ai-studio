import { useEffect } from "react";
import { listen, BroadcastEventRegistry } from "@/shared/utils/event-broadcast";

type EventName = keyof BroadcastEventRegistry;
type EventPayload<K extends EventName> = BroadcastEventRegistry[K];

export const useBroadcastEvent = <K extends EventName>(
  event: K,
  handler: (payload: EventPayload<K>) => void
): void => {
  useEffect(() => {
    const unsubscribe = listen(event, handler);
    return unsubscribe;
  }, [event, handler]);
};
