import { Container, Flex, Label, Section, Spacer, Text, Title } from "@siteground/styleguide";
import { Colors } from "@siteground/styleguide/lib/components/with-color/types";
import * as React from "react";

interface Props {
  title: string;
  label?: string;
  labelColor?: Colors;
  name?: string;
  description?: string;
  extraDescription?: React.ReactNode;
  actions: React.ReactNode;
}

const ActionCard: React.FC<Props> = ({
  title,
  name,
  label,
  labelColor = "primary",
  description,
  extraDescription,
  actions,
}) => {
  return (
    <Section>
      <Flex gap="x-small" direction="column">
        <Title level="4">{title}</Title>
        <Container padding="large">
          <Flex gap="responsive" align="center" wrap="nowrap">
            <Flex direction="column" grow="1" gap="x-small">
              <Flex align="center">
                <Title level="4" weight="bold">
                  {name}
                </Title>
                <Spacer size="x-small" />
                {label && <Label color={labelColor}>{label}</Label>}
              </Flex>
              {description && <Text>{description}</Text>}
              {extraDescription && extraDescription}
            </Flex>
            <Flex gap="xx-large">
              <div>{actions}</div>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Section>
  );
};

export default ActionCard;
