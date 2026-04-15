import { Text } from "@siteground/styleguide";
import { Components } from "react-markdown";

interface Props {
  className?: string;
}

export const MDTextComponents = ({ className }: Props): Partial<Components> => {
  return {
    p: ({ children }) => (
      <Text tag="p" className={className}>
        {children}
      </Text>
    ),
    span: ({ children }) => (
      <Text tag="span" className={className}>
        {children}
      </Text>
    ),
    em: ({ children }) => (
      <Text tag="em" className={className}>
        {children}
      </Text>
    ),
    strong: ({ children }) => (
      <Text tag="strong" weight="bold" className={className}>
        {children}
      </Text>
    ),
    del: ({ children }) => (
      <Text tag="del" className={className}>
        {children}
      </Text>
    ),
  };
};
