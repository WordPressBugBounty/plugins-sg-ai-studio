import { getStore } from "@/store";
import { DialogManager } from "@siteground/styleguide/lib/composite/dialogs";
import { DIALOG_IDS } from "@/shared/constants/dialogs";

type PendingNavigation = {
  type: "url" | "reload" | "back";
  url?: string;
};

type NavigationInterceptionOptions = {
  interceptPageNavigation?: boolean;
  interceptPageRefresh?: boolean;
};

class NavigationController {
  private pendingNavigation: PendingNavigation | null = null;
  private isInitialized = false;
  private originalBeforeUnload: ((event: BeforeUnloadEvent) => any) | null = null;

  /**
   * Initialize navigation interception for WordPress admin pages
   * @param options Configuration for what types of navigation to intercept
   */
  init(options: NavigationInterceptionOptions = { interceptPageNavigation: true, interceptPageRefresh: true }) {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (options.interceptPageRefresh) {
      this.setupBeforeUnloadHandler();
    }

    if (options.interceptPageNavigation) {
      this.setupLinkInterception();
    }
  }

  /**
   * Handle page unload attempts (refresh, close, back/forward)
   */
  private setupBeforeUnloadHandler() {
    // Store original beforeunload handler if it exists
    this.originalBeforeUnload = window.onbeforeunload;

    window.addEventListener("beforeunload", (event) => {
      if (getStore().getState().messages.activeStreamingMessageId !== null) {
        this.pendingNavigation = { type: "reload" };

        // Show browser's built-in confirmation dialog
        event.preventDefault();
        event.returnValue = "";
        return "";
      }

      // If no streaming, allow normal beforeunload behavior
      if (this.originalBeforeUnload) {
        return this.originalBeforeUnload(event);
      }
    });
  }

  /**
   * Intercept clicks on WordPress admin links
   */
  private setupLinkInterception() {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        const link = target.closest("a[href]") as HTMLAnchorElement;

        if (!link || !this.isWordPressAdminLink(link)) {
          return;
        }

        // Check if streaming is active
        if (getStore().getState().messages.activeStreamingMessageId !== null) {
          event.preventDefault();
          event.stopPropagation();

          // Store the intended navigation
          this.pendingNavigation = {
            type: "url",
            url: link.href,
          };

          // Show our custom dialog
          DialogManager.open(DIALOG_IDS.ACTIVE_STREAM_DIALOG);
        }
      },
      true
    ); // Use capture phase to intercept before other handlers
  }

  /**
   * Check if link is a WordPress admin navigation link
   */
  private isWordPressAdminLink(link: HTMLAnchorElement): boolean {
    const href = link.href;

    // Skip if it's not a same-origin link
    if (link.hostname !== window.location.hostname) {
      return false;
    }

    // Skip if it's a hash link or javascript: link
    if (href.startsWith("#") || href.startsWith("javascript:")) {
      return false;
    }

    // Check if it's in WordPress admin area
    return href.includes("/wp-admin/") || link.classList.contains("wp-menu-item");
  }

  /**
   * Execute the pending navigation that was blocked
   * Called from the dialog after user confirms
   */
  executePendingNavigation() {
    if (!this.pendingNavigation) {
      return;
    }

    const navigation = this.pendingNavigation;
    this.pendingNavigation = null;

    // Execute the navigation based on type
    switch (navigation.type) {
      case "url":
        if (navigation.url) {
          window.location.href = navigation.url;
        }
        break;
      case "reload":
        window.location.reload();
        break;
      case "back":
        window.history.back();
        break;
    }
  }

  clearPendingNavigation() {
    this.pendingNavigation = null;
  }

  hasPendingNavigation(): boolean {
    return this.pendingNavigation !== null;
  }

  destroy() {
    if (!this.isInitialized) {
      return;
    }

    this.isInitialized = false;
    this.pendingNavigation = null;

    // Restore original beforeunload handler
    if (this.originalBeforeUnload) {
      window.onbeforeunload = this.originalBeforeUnload;
      this.originalBeforeUnload = null;
    } else {
      window.onbeforeunload = null;
    }
  }
}

const navigationController = new NavigationController();

export { navigationController };
