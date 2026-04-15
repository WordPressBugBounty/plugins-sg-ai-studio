import { List, ListItem } from "@siteground/styleguide";
import { Components } from "react-markdown";
import { createContext, useContext, ReactNode } from "react";

interface Props {
  className?: string;
}

enum LIST_TYPE {
  ordered = "ordered",
  unordered = "unordered",
}

const ListTypeContext = createContext<LIST_TYPE>(LIST_TYPE.unordered);

const UnorderedList = ({ children, className }: { children: ReactNode; className?: string }) => (
  <List className={className}>
    <ListTypeContext.Provider value={LIST_TYPE.unordered}>{children}</ListTypeContext.Provider>
  </List>
);

const OrderedList = ({ children, className }: { children: ReactNode; className?: string }) => (
  <List ordered className={className}>
    <ListTypeContext.Provider value={LIST_TYPE.ordered}>{children}</ListTypeContext.Provider>
  </List>
);

const ListItemComponent = ({ children, className }: { children: ReactNode; className?: string }) => {
  const type = useContext(ListTypeContext);
  return (
    <ListItem iconSize="16" icon={type === LIST_TYPE.unordered ? "dot" : undefined} className={className}>
      {children}
    </ListItem>
  );
};

export const MDListComponents = ({ className }: Props): Partial<Components> => {
  return {
    ul: ({ children }) => <UnorderedList className={className}>{children}</UnorderedList>,
    ol: ({ children }) => <OrderedList className={className}>{children}</OrderedList>,
    li: ({ children }) => <ListItemComponent className={className}>{children}</ListItemComponent>,
  };
};
