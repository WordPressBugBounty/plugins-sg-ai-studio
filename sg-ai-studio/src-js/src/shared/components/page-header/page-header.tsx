import { Title, Card, Section, Flex } from "@siteground/styleguide/lib";
import React from "react";

interface Props {
  description: string;
  title: string;
  iconName: string;
  src?: string;
}

const PageHeader: React.FC<Props> = ({ description, title, iconName }) => (
  <Section>
    <Flex gap="medium" direction="column">
      <Title level="1" align="left">
        {title}
      </Title>
      <Card iconName={iconName} iconColor="primary" text={description} />
    </Flex>
  </Section>
);

export default PageHeader;
