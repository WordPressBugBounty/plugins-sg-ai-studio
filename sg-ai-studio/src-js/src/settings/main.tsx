import { BootstrapWordpress, ThemeProvider } from "@siteground/styleguide";
import { NotificationsContainer } from "@/shared/components/notifications-container/notifications-container";
import { Provider } from "react-redux";
import { InitOptions } from "@/shared/types/config";
import { initializeStore } from "../store";
import { saveConfig } from "../store/slices/app/appSlice";
import { createShadowRoot } from "@/shared/utils/create-shadow-root";
import { initializeAiToken } from "@/shared/tokens/token";
import { cleanupLegacyLocalStorage } from "@/shared/utils/local-storage";
import SettingsContainer from "./components/container";

const WPAIStudioSettings = {
  init: (options: InitOptions): void => {
    const store = initializeStore(options.config);
    initializeAiToken(options.config);
    cleanupLegacyLocalStorage();

    store.dispatch(saveConfig(options.config));

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
              <SettingsContainer />
              <NotificationsContainer />
            </ThemeProvider>
          </BootstrapWordpress>
        </Provider>
      ),
      "settings.css"
    );
  },
};

export default WPAIStudioSettings;
