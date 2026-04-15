import { useGetPowermodeQuery, useUpdatePowermodeMutation } from "@/store/api/wp-api";
import { genericNotifications } from "@/shared/components/notifications-container/generic-notifications";
import { translate } from "i18n-calypso";
import { broadcast } from "@/shared/utils/event-broadcast";

export const usePowermode = () => {
  const { data: powermodeData, isLoading: powermodeLoading } = useGetPowermodeQuery();
  const [updatePowermode, { isLoading: powermodeMutationLoading }] = useUpdatePowermodeMutation();

  const isPowerModeLoading = powermodeLoading || powermodeMutationLoading;

  const handlePowerModeToggle = async (enabled: boolean) => {
    try {
      const result = await updatePowermode({ enabled });

      broadcast("powermode_changed", { enabled: result.data.enabled });

      genericNotifications.addNotification({
        type: "success",
        message: result.data.enabled ? translate("Power Mode is enabled") : translate("Power Mode is disabled"),
      });
    } catch (error) {
      genericNotifications.addNotification({
        type: "error",
        message: translate("Something went wrong. Please try again."),
      });
      return;
    }
  };

  return {
    isPowerModeEnabled: powermodeData?.enabled,
    isPowerModeLoading,
    handlePowerModeToggle,
  };
};
