import Notifications from "@siteground/styleguide/lib/components/notifications/notifications";
import NotificationContainer from "@siteground/styleguide/lib/composite/notifications/notification-container";
import { useNotificationsCollection } from "@siteground/core-notifications-manager";
import { genericNotifications } from "./generic-notifications";

export const NotificationsContainer: React.FC = () => {
  const notifications = useNotificationsCollection(genericNotifications);

  return (
    <Notifications>
      {notifications.map((n) => {
        return (
          <NotificationContainer
            key={n.id}
            defaultSuccessTitle="Success"
            defaultErrorTitle="Failure"
            notification={{
              // notification collection id's are strings, styleguide, needs numbers, which is not ideal
              id: n.id as any,
              title: n.data.title,
              type: n.data.type,
              message: n.data.message,
              behaviour: "autoClose",
            }}
            removeNotification={(id) => genericNotifications.deleteNotification(String(id))}
          />
        );
      })}
    </Notifications>
  );
};
