import { Components } from "react-markdown";
import { IconButton, Title } from "@siteground/styleguide";
import { MutableRefObject } from "react";
import { cn } from "@siteground/styleguide/lib";

interface Props {
  copyToClipboardRef: MutableRefObject<
    (content: string, options: { contentType: "text/html" | "text/plain" | "image" }) => void
  >;
  fadeEffect?: string;
}

export const MDCodeComponents = ({ copyToClipboardRef, fadeEffect }: Props): Partial<Components> => {
  const getLanguageFromClassName = (className: string): string => {
    const match = className.match(/language-(\w+)/);
    if (match) {
      const language = match[1];
      return language.charAt(0).toUpperCase() + language.slice(1);
    }
    return "Code";
  };

  return {
    pre: ({ children }: any) => {
      // Check if this is an HTML code block
      const sourceCode = children?.props?.children;
      const className = children?.props?.className || "";

      // Enhanced code block with language label and copy functionality
      const language = getLanguageFromClassName(className);

      return (
        <div className={cn("sg-code-wrapper", fadeEffect)}>
          <div className="sg-code-header">
            <Title level="6">{language}</Title>
            <IconButton
              className="sg-code-header__copy-button"
              icon="material/content_copy"
              size="small"
              color="secondary"
              onClick={() => {
                copyToClipboardRef.current(sourceCode, {
                  contentType: "text/plain",
                });
              }}
            />
          </div>
          <pre className="sg-code-block">{children}</pre>
        </div>
      );
    },
    code: ({ children }) => <code className={cn("sg-code-inline", fadeEffect)}>{children}</code>,
  };
};
