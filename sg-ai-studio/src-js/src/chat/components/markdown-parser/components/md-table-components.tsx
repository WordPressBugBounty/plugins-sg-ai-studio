import { IconButton } from "@siteground/styleguide";
import { Components } from "react-markdown";
import { MutableRefObject } from "react";
import { cn } from "@siteground/styleguide/lib";

interface Props {
  copyToClipboardRef: MutableRefObject<(content: string, options?: { contentType?: string }) => void>;
  fadeEffect?: string;
}

export const MDTableComponents = ({ copyToClipboardRef, fadeEffect }: Props): Partial<Components> => {
  let currentTableNode: any = null;
  let headerRowCount = 0;

  return {
    table: ({ children, node }) => {
      currentTableNode = node;
      headerRowCount = 0;

      return (
        <div className={cn("sg-table-container", fadeEffect)}>
          <div className="sg-table-wrapper" style={{ maxWidth: "100%", overflowX: "auto" }}>
            <table className="sg-table">{children}</table>
          </div>
        </div>
      );
    },
    thead: ({ children }) => <thead>{children}</thead>,
    tr: ({ children, node }) => {
      const isHeaderRow = node?.tagName === "tr" && node?.children?.some((child: any) => child.tagName === "th");

      if (isHeaderRow && headerRowCount === 0) {
        headerRowCount++;
        const capturedTableNode = currentTableNode;
        const extractTableText = () => {
          if (!capturedTableNode) return "";

          const rows: string[] = [];

          capturedTableNode.children.forEach((section: any) => {
            if (!section.children) return;
            section.children.forEach((row: any) => {
              if (!row.children) return;
              const cells: string[] = [];
              row.children.forEach((cell: any) => {
                if (!cell.children) return;
                const cellText = cell.children
                  .map((child: any) => child.value || "")
                  .join(" ")
                  .trim();
                cells.push(cellText);
              });
              rows.push(`| ${cells.join(" | ")} |`);
            });
          });

          return rows.join("\n");
        };

        return (
          <tr>
            {children}
            <th className="sg-table-copy-header">
              <IconButton
                icon="material/content_copy"
                color="secondary"
                size="small"
                onClick={() => {
                  const tableText = extractTableText();
                  copyToClipboardRef.current(tableText, {
                    contentType: "text/plain",
                  });
                }}
              />
            </th>
          </tr>
        );
      }
      return (
        <tr>
          {children}
          <td className="sg-table-copy-cell"></td>
        </tr>
      );
    },
    th: ({ children }) => <th>{children}</th>,
    td: ({ children }) => <td>{children}</td>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
  };
};
