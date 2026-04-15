const BROADCAST_CHANNEL_NAME = "wp-ai-studio-events";

export interface BroadcastEventRegistry {
  connection_status_changed: {
    type: "connected" | "disconnected";
  };
  powermode_changed: {
    enabled: boolean;
  };
}

type EventName = keyof BroadcastEventRegistry;
type EventPayload<K extends EventName> = BroadcastEventRegistry[K];

interface BroadcastMessage<K extends EventName = EventName> {
  event: K;
  payload: EventPayload<K>;
  timestamp: number;
}

class BroadcastEventManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<EventName, Set<(payload: any) => void>> = new Map();

  private ensureChannel(): void {
    if (!this.channel && typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = this.handleMessage.bind(this);
      } catch (error) {
        console.warn("Failed to create BroadcastChannel:", error);
      }
    }
  }

  private handleMessage(e: MessageEvent<BroadcastMessage>): void {
    const handlers = this.listeners.get(e.data.event);
    if (handlers) {
      handlers.forEach((handler) => handler(e.data.payload));
    }
  }

  broadcast<K extends EventName>(event: K, payload: EventPayload<K>): void {
    this.ensureChannel();
    if (this.channel) {
      try {
        const message: BroadcastMessage<K> = {
          event,
          payload,
          timestamp: Date.now(),
        };
        this.channel.postMessage(message);
      } catch (error) {
        console.warn(`Failed to broadcast event "${event}":`, error);
      }
    }
  }

  listen<K extends EventName>(event: K, handler: (payload: EventPayload<K>) => void): () => void {
    this.ensureChannel();

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);

    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }
}

const manager = new BroadcastEventManager();

export const broadcast = <K extends EventName>(event: K, payload: EventPayload<K>): void => {
  manager.broadcast(event, payload);
};

export const listen = <K extends EventName>(event: K, handler: (payload: EventPayload<K>) => void): (() => void) => {
  return manager.listen(event, handler);
};
