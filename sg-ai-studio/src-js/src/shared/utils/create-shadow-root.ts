import ReactDOM from "react-dom/client";
import { ReactElement } from "react";
import { InitOptions } from "@/shared/types/config";

type RenderFn = (shadowRoot: ShadowRoot) => ReactElement;

const injectGlobalTooltipStyles = () => {
  // INFO: Tooltips live live outside of the shadow DOM (in Portal)
  // and we no longer import SG stylesheets in wordpress to avoid overwriting 3rd party styles

  const style = document.createElement("style");
  style.textContent = `
    .sg-tooltip {
      position: absolute;
      max-width: 320px;
      padding: 7px;
      border: 1px solid rgba(255 255 255 / 0);;
      border-radius: 4px;
      background: rgba(0 0 0 / 0.95);
      color: #fff;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      overflow-wrap: break-word;
      z-index: 99999999;
    }

    .sg-tooltip--background-white {
      background-color: var(--tooltip-background-light);
    }

    .sg-tooltip--density-none {
      padding: 0;
    }
  `;
  document.head.appendChild(style);
};

const injectStylesIntoShadowDOM = (shadowRoot: ShadowRoot, options: InitOptions, cssFileName: string) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const shadowHead = document.createElement("head");

  if (isDevelopment) {
    const existingStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    existingStyles.forEach((styleElement) => {
      const clonedStyle = styleElement.cloneNode(true) as HTMLElement;
      shadowHead.appendChild(clonedStyle);
      shadowRoot.prepend(shadowHead);
    });
  } else {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${options.config.assetsPath}css/${cssFileName}`;
    shadowHead.appendChild(link);
    shadowRoot.prepend(shadowHead);
  }
};

export const createShadowRoot = (
  options: InitOptions,
  renderApp: RenderFn,
  cssFileName: string
): ReactDOM.Root | null => {
  const domElement = document.getElementById(options.domElementId);
  if (!domElement) {
    console.error(`Element with ID "${options.domElementId}" not found`);
    return null;
  }

  injectGlobalTooltipStyles();

  const shadowRoot = domElement.attachShadow({ mode: "open" });
  injectStylesIntoShadowDOM(shadowRoot, options, cssFileName);

  const root = ReactDOM.createRoot(shadowRoot);
  root.render(renderApp(shadowRoot));

  return root;
};
