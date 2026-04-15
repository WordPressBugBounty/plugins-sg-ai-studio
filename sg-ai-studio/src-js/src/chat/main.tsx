import { BootstrapWordpress, ThemeProvider } from "@siteground/styleguide";
import { Provider } from "react-redux";
import { InitOptions } from "@/shared/types/config";
import { initializeStore } from "../store";
import { saveConfig } from "../store/slices/app/appSlice";
import { setMinimized } from "../store/slices/chat/chatSlice";
import { NotificationsContainer } from "@/shared/components/notifications-container/notifications-container";
import { createShadowRoot } from "@/shared/utils/create-shadow-root";
import ActiveStreamDialog from "@/shared/components/dialogs/active-stream-dialog";
import { navigationController } from "./utils/navigation-controller";
import { startSessionCleanupManager } from "@/shared/utils/session-cleanup-manager";
import { initializeAiToken } from "@/shared/tokens/token";
import { cleanupLegacyLocalStorage } from "@/shared/utils/local-storage";
import ChatContainer from "./components/container";

const WPAIStudioChat = {
  init: (options: InitOptions): void => {
    const store = initializeStore(options.config);
    initializeAiToken(options.config);
    cleanupLegacyLocalStorage();

    store.dispatch(saveConfig(options.config));

    if (options.config.minimizeOverride === true) {
      store.dispatch(setMinimized(true));
    }

    navigationController.init({ interceptPageNavigation: true, interceptPageRefresh: false });

    startSessionCleanupManager(store);

    const assetsPath = options.config.assetsPath;
    const svgAssets = assetsPath + "/images";
    const fontAssets = assetsPath + "/fonts";
    const dataAssets = assetsPath + "/data";

    createShadowRoot(
      options,
      (shadowRoot) => (
        <Provider store={store}>
          <BootstrapWordpress
            fontsInjectTarget={shadowRoot}
            context={{ config: { svgAssetsPath: svgAssets, fontsAssetsPath: fontAssets, dataAssetsPath: dataAssets } }}
          >
            <ThemeProvider theme="light">
              <ChatContainer />
              <NotificationsContainer />
              <ActiveStreamDialog />
            </ThemeProvider>
          </BootstrapWordpress>
        </Provider>
      ),
      "chat.css"
    );
  },
};

export default WPAIStudioChat;
