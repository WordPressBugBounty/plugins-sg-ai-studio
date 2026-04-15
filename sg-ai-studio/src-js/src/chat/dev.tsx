import { appConfig } from "@/app-config";
import { PAGE_ROUTES } from "../shared/constants/routes";
import { CHAT_ROOT_ELEMENT_DOM_ID } from "./constants/chat";
import WPAIStudioChat from "./main";

WPAIStudioChat.init({
  domElementId: CHAT_ROOT_ELEMENT_DOM_ID,
  page: PAGE_ROUTES.CHAT,
  config: appConfig,
});
