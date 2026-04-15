const baseUrl = "https://georgichochev.com";

export const appConfig = {
  home_url: baseUrl,
  admin_url: `${baseUrl}/wp-admin`,
  rest_base: `${baseUrl}/wp-json`,
  assetsPath: "public",
  localeSlug: "en-US",
  locale: '{"":{"domain":"wp-ai-studio-plugin","lang":"en_US"}}',
  wp_nonce: null,
  is_staging: false,
  welcome_msg:
    "Hi! I am your personal WordPress AI assistant, you can ask me any questions related to your WordPress site. I can help you with a wide range of tasks, including but not limited to:\n\n**Site Management & Troubleshooting**\n- Diagnose and fix plugin or theme conflicts\n- Troubleshoot errors, slowdowns, or broken pages\n- Monitor and analyze security or performance issues\n\n**Plugin & Theme Support**\n- List, activate, deactivate, update, or install plugins/themes\n- Analyze plugin or theme functionality and compatibility\n- Provide recommendations for the best plugins for your needs",
  minimizeOverride: false,
  quickActions: {
    categories: [
      {
        type: "most-popular",
        title: "Most Popular",
        icon: "star"
      },
      {
        type: "create-and-generate",
        title: "Create & Generate",
        icon: "edit_square"
      },
      {
        type: "audit-and-ptimize",
        title: "Audit & Optimize",
        icon: "trending_up"
      },
      {
        type: "bulk-actions",
        title: "Bulk Actions",
        icon: "check_box"
      },
    ],
    actions: {
      "most-popular": [
        "Write a SEO-friendly blog post with AI images and headings",
        "Speed up my site automatically (with SiteGround Speed Optimizer)",
        "Generate sales report for last week including best selling products",
      ],
      "create-and-generate": [
        "Write a blog post with images and SEO",
        "Create a new page from scratch (with Gutenberg building blocks)",
        "Generate product descriptions (for WooCommerce)",
        "Create 10 blog post title ideas",
      ],
      "audit-and-ptimize" : [
        "Speed - Optimize site performance (caching, images, CSS via SiteGround Speed Optimizer)",
        "Security - Check site security status (via Security Optimizer)",
        "Run full SEO audit of my site",
        "Check if my site, plugins and themes are up-to-date",
      ],
      "bulk-actions": [
        "Create 5 blog post drafts at once",
        "Apply a 20% discount to all products in category (keeping Regular price unchanged)",
        "Delete all spam comments",
        "Create 3 new parent post categories with 5 sub-categories for each",
      ],
    },
    actionsTitle: "Suggested actions"
  }
};
