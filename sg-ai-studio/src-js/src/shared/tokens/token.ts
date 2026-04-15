import { TokensManager } from "@siteground/core-tokens-manager";
import { Token } from "../types/token";
import { getStorageKeys } from "../utils/local-storage";
import type { WPAIStudioConfig } from "../types/config";

let aiTokenInstance: TokensManager<Token> | null = null;

export const initializeAiToken = (config: WPAIStudioConfig): TokensManager<Token> => {
  if (aiTokenInstance) {
    return aiTokenInstance;
  }

  const keys = getStorageKeys(config);

  aiTokenInstance = new TokensManager<Token>({
    tokenName: keys.TOKEN,
    storageStrategy: "localStorage",
    refreshToken() {
      return new Promise((resolve) => {
        const unableToResolveToken = () => {
          resolve(null);
        };

        import("../../store").then(({ getStore }) => {
          const store = getStore();
          const headers = store.getState().app.config.wp_nonce
            ? {
                "content-type": "application/json",
                "X-WP-Nonce": store.getState().app.config.wp_nonce,
              }
            : {
                "content-type": "application/json",
              };

          fetch(`${store.getState().app.config.rest_base}/sg-ai-studio/generate-token`, {
            method: "POST",
            headers,
          })
            .then((response) => {
              response
                .json()
                .then((jsonResponse) => {
                  if (response.status >= 400) {
                    return unableToResolveToken();
                  }

                  return resolve(jsonResponse.token);
                })
                .catch(() => unableToResolveToken());
            })
            .catch(() => unableToResolveToken());
        });
      });
    },
    isTokenExpired: (token) => Number(token.cts + token.vsec) * 1000 < +new Date(),
  });

  return aiTokenInstance;
};

export const getAiToken = (): TokensManager<Token> => {
  if (!aiTokenInstance) {
    throw new Error("Token manager not initialized. Call initializeAiToken(config) first.");
  }
  return aiTokenInstance;
};
