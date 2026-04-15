import { Title } from "@siteground/styleguide";
import { Components } from "react-markdown";

interface Props {
  className?: string;
}

export const MDTitleComponents = ({ className }: Props): Partial<Components> => {
  return {
    h1: ({ children }) => (
      <Title level="1" className={className}>
        {children}
      </Title>
    ),
    h2: ({ children }) => (
      <Title level="2" className={className}>
        {children}
      </Title>
    ),
    h3: ({ children }) => (
      <Title level="3" className={className}>
        {children}
      </Title>
    ),
    h4: ({ children }) => (
      <Title level="4" className={className}>
        {children}
      </Title>
    ),
    h5: ({ children }) => (
      <Title level="5" className={className}>
        {children}
      </Title>
    ),
    h6: ({ children }) => (
      <Title level="6" className={className}>
        {children}
      </Title>
    ),
  };
};
