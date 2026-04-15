import { useAppSelector, useAppDispatch } from "@/store/hooks";
import i18n from "i18n-calypso";
import { FC, useMemo, useEffect, useCallback } from "react";
import ChatLayout from "./chat-layout/chat-layout";
import { cancelReply } from "@/store/thunks/chat-thunks";
import { useCheckStatusQuery } from "@/store/api/wp-api";
import { clearAllAppData, hasChatState, hasToken } from "@/shared/utils/local-storage";
import { useBroadcastEvent } from "@/shared/hooks/use-broadcast-event";

const ChatContainer: FC = () => {
  const config = useAppSelector((state) => state.app.config);
  const dispatch = useAppDispatch();
  const { data: checkStatusData, refetch } = useCheckStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    return () => {
      dispatch(cancelReply());
    };
  }, [dispatch]);

  const handleConnectionChange = useCallback(() => {
    clearAllAppData(config);
    refetch();
  }, [refetch, config]);

  useBroadcastEvent("connection_status_changed", handleConnectionChange);

  // Set up i18n locale
  const localeConfig = useMemo(() => {
    if (!config.locale) return { "": { localeSlug: config.localeSlug || "en" } };
    const locale = JSON.parse(config.locale);
    locale[""].localeSlug = config.localeSlug || "en";
    return locale;
  }, [config.locale, config.localeSlug]);

  useEffect(() => {
    i18n.setLocale(localeConfig);
  }, [localeConfig]);

  useEffect(() => {
    if (checkStatusData?.connected === false) {
      if (hasChatState(config) || hasToken(config)) {
        clearAllAppData(config);
      }
    }
  }, [checkStatusData?.connected, config]);

  if (!checkStatusData?.connected) {
    return null;
  }

  return <ChatLayout />;
};

export default ChatContainer;
