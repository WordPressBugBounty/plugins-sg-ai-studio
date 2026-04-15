import * as React from "react";
import cn from "@siteground/styleguide/lib/utils/classnames";
import scrollToElement from "@siteground/styleguide/lib/utils/scroll-to-element";
import { Flex, Notice, Text } from "@siteground/styleguide";
import "./styles.scss";

interface Props {
  message?: string;
  type?: "error" | "warning" | "success" | "info" | "hint";
  children?: React.ReactNode;
}

const SystemMessage: React.FC<Props> = ({ message, type = "error", children }) => {
  const domRef = React.useRef(null);

  const classes = cn("action-container");

  React.useEffect(() => {
    scrollToElement(domRef.current, {
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  }, []);

  return (
    <Notice type={type} className={classes} ref={domRef}>
      <Flex direction="column" gap="small">
        <Text align="left">{message}</Text>

        {children && (
          <Flex gap="x-small" className="action-container__buttons">
            {children}
          </Flex>
        )}
      </Flex>
    </Notice>
  );
};

export default SystemMessage;
