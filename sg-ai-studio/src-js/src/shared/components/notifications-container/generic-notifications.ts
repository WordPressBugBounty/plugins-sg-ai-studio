import { NotificationsCollection } from "@siteground/core-notifications-manager";
import { NotificationStatusType } from "@siteground/styleguide/lib/types";

export type GenericNotificaiton = {
  type: NotificationStatusType;
  title?: string;
  message: string;
};

export const genericNotifications = new NotificationsCollection<GenericNotificaiton>();
