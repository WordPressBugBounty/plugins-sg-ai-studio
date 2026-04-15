import { Layout, Page, Section } from "@siteground/styleguide";
import "./styles.scss";

const PageLayout = ({ children }) => {
  return (
    <Layout
      position="relative"
      pageContent={
        <Page>
          <Section density="none" className="wp-ai-studio-page-layout">
            {children}
          </Section>
        </Page>
      }
    ></Layout>
  );
};

export default PageLayout;
