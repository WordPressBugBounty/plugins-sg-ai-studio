import { appConfig } from "@/app-config";
import { PAGE_ROUTES } from "../shared/constants/routes";
import WPAIStudioSettings from "./main";

WPAIStudioSettings.init({
  domElementId: "wp-ai-studio-settings-container",
  page: PAGE_ROUTES.SETTINGS,
  config: appConfig,
});
