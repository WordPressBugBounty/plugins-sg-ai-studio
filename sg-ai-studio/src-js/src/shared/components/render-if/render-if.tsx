import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  condition: boolean;
}
export const RenderIf = ({ condition, children }: Props) => {
  if (!condition) {
    return null;
  }

  return children;
};
