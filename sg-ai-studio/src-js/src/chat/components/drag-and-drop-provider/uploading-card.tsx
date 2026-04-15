import { Flex, Icon, Text, Title } from "@siteground/styleguide";

import "./styles.scss";
import { cn } from "@siteground/styleguide/lib";
import { useDragAndDrop } from "./drag-and-drop-provider";

interface LargeUploadCardProps {
  title?: string;
  upperSubtitle?: string;
  lowerSubtitle?: string;
  dndTextCta?: string;
  subDndTextCta?: string;
  icon?: string;
  isDragAndDropActive?: boolean;
  className?: string;
}

export const LargeUploadCard: React.FunctionComponent<LargeUploadCardProps> = ({
  title,
  upperSubtitle,
  lowerSubtitle,
  dndTextCta,
  subDndTextCta,
  isDragAndDropActive = false,
  icon = "material/upload",
  className,
}) => {
  const { openFileSelector } = useDragAndDrop();
  const classes = cn("upload-card", className);

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="medium"
      className={classes}
      onClick={openFileSelector}
    >
      <Flex direction="column" gap="large" align="center">
        <Icon size={64} name={icon} color={isDragAndDropActive ? "primary" : "typography-disabled"} />
        <Flex direction="column" gap="x-small" align="center">
          <Text size="large">{dndTextCta}</Text>
          <Text size="large">{subDndTextCta}</Text>
          <Title level="5" tag="span" color="primary" transform="uppercase">
            {title}
          </Title>
        </Flex>
      </Flex>
      <Flex direction="column" gap="xx-small" align="center" className="upload-card__subtitle-large">
        <Text size="small" color="typography-tertiary">
          {upperSubtitle}
        </Text>
        <Text size="small" color="typography-tertiary">
          {lowerSubtitle}
        </Text>
      </Flex>
    </Flex>
  );
};
