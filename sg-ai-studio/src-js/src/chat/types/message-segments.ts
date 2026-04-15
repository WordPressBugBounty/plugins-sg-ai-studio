import { QuickActions } from "@/shared/types/config";
import { ReceivePacket, UserActionRequest } from "../api/types";

export interface TextSegment {
  type: "text";
  content: string;
}

export interface ToolSegment {
  type: "tool";
  toolPacket: ReceivePacket;
}

export interface UserActionSegment {
  type: "action";
  actionPacket: UserActionRequest;
}

export interface QuickActionsSegment {
  type: "quick-actions";
  content: QuickActions;
}

// A message segment can be either bot text content or a tool interaction
export type MessageSegment = TextSegment | ToolSegment | UserActionSegment | QuickActionsSegment;