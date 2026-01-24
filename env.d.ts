declare namespace NodeJS {
  interface ProcessEnv {
    WORDPRESS_PREVIEW_SECRET: string;
    WORDPRESS_API_URL: string;
    WORDPRESS_API_USER: string;
    WORDPRESS_API_PASSWORD: string;
    PUBLIC_SITE_URL: string;
    WP_GRAPHQL_ENDPOINT: string;
  }
}
