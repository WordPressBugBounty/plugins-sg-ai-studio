import { Icon, Loader } from "@siteground/styleguide";
import { LoaderProps } from "@siteground/styleguide/lib/components/types";

import { RenderIf } from "../render-if/render-if";
import { createContext } from "react";

interface PartialLoaderTypes extends Partial<LoaderProps> {
  isLoadingAPIs: boolean[];
  hideChildrenWhenLoading?: boolean;
}

const LoaderContext = createContext({
  parentLoaderVisible: false,
});

const CustomLoaderIcon = () => <Icon name="animated/sg-logo" size="120" multicolor />;

export const PartialLoader: React.FC<PartialLoaderTypes> = ({
  children,
  isLoadingAPIs = [],
  hideChildrenWhenLoading,
  position = "absolute",
  borderRadius = "default",
  ...loaderProps
}) => (
  <LoaderContext.Consumer>
    {({ parentLoaderVisible }) => {
      const isLoading = Boolean(isLoadingAPIs.filter(Boolean).length);
      const isParentLoaderVisible = isLoading || parentLoaderVisible;
      const shouldRenderLoader = isLoading && !parentLoaderVisible;
      const shouldRenderChildrenWhenLoading = !(hideChildrenWhenLoading && shouldRenderLoader);

      return (
        <LoaderContext.Provider
          value={{
            parentLoaderVisible: isParentLoaderVisible,
          }}
        >
          <RenderIf condition={shouldRenderChildrenWhenLoading}>{children}</RenderIf>

          <RenderIf condition={shouldRenderLoader}>
            <Loader
              position={position}
              borderRadius={borderRadius}
              renderCustomIcon={CustomLoaderIcon}
              delay={50}
              {...loaderProps}
            />
          </RenderIf>
        </LoaderContext.Provider>
      );
    }}
  </LoaderContext.Consumer>
);
