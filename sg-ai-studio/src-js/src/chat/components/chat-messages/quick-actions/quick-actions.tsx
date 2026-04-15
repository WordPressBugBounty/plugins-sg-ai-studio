import { FC, useState } from "react";
import { Button, Flex, List, ListItem, Text } from "@siteground/styleguide";
import { cn } from "@siteground/styleguide/lib";

import { CHAT_QUICK_ACTION_DEFAULT } from "@/chat/constants/chat";
import { askQuestion } from "@/store/thunks/chat-thunks";
import { useAppDispatch } from "@/store/hooks";
import { QuickActionCategory } from "@/shared/types/config";

import "./styles.scss";

interface Props {
  categories: QuickActionCategory[];
  actionsTitle: string;
  actions: Record<string, string[]>;
}

const QuickActions: FC<Props> = ({ categories, actionsTitle, actions }) => {
  const dispatch = useAppDispatch();
  const [activeQuickAction, setActiveQuickAction] = useState(CHAT_QUICK_ACTION_DEFAULT);

  const handleSendMessage = (message: string) => {
    dispatch(askQuestion({ question: message }));
  };

  return (
    <Flex direction="column" gap="large">
      <Flex gap="medium">
        {categories?.map((category) => (
          <span key={category.type}>
            <Button
              className={cn("quick-actions__button", activeQuickAction === category.type && "active")}
              color="tertiary"
              leadingIcon={category.icon}
              onClick={() => setActiveQuickAction(category.type)}
            >
              {category.title}
            </Button>
          </span>
        ))}
      </Flex>

      <Flex direction="column" gap="x-small">
        <Text color="typography-secondary" size="medium" weight="bold">
          {actionsTitle}
        </Text>
        <List size="medium" density="large">
          {actions[activeQuickAction]?.map((action: string) => (
            <ListItem
              key={action}
              className="quick-actions__action-item"
              icon="material/subdirectory_arrow_right"
              iconSize="18"
              iconColor="typography-tertiary"
              padding={["xx-small", "small"]}
              onClick={() => handleSendMessage(action)}
            >
              {action}
            </ListItem>
          ))}
        </List>
      </Flex>
    </Flex>
  );
};

export default QuickActions;
