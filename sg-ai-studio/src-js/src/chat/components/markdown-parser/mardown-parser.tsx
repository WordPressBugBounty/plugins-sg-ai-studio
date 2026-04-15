import { useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { MDCodeComponents } from "./components/md-code-components";
import { MDListComponents } from "./components/md-list-components";
import { MDMiscComponents } from "./components/md-misc-components";
import { MDTableComponents } from "./components/md-table-components";
import { MDTextComponents } from "./components/md-text-components";
import { MDTitleComponents } from "./components/md-title-components";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import "./styles.scss";

interface MarkdownRendererProps {
  children: string;
}

export const MarkdownParser = ({ children }: MarkdownRendererProps) => {
  const { copyToClipboard } = useCopyToClipboard();
  const copyToClipboardRef = useRef(copyToClipboard);

  copyToClipboardRef.current = copyToClipboard;

  const fadeEffect = "";

  const markdownComponents = useMemo(() => {
    return {
      ...MDTextComponents({ className: fadeEffect }),
      ...MDTitleComponents({ className: fadeEffect }),
      ...MDListComponents({ className: fadeEffect }),
      ...MDMiscComponents({ className: fadeEffect }),
      ...MDCodeComponents({
        copyToClipboardRef,
        fadeEffect,
      }),
      ...MDTableComponents({ copyToClipboardRef, fadeEffect: fadeEffect }),
    };
  }, [fadeEffect]);

  return (
    <ReactMarkdown
      components={markdownComponents as any}
      remarkPlugins={[remarkGfm, remarkEmoji]}
      rehypePlugins={[rehypeRaw]}
    >
      {children}
    </ReactMarkdown>
  );
};
