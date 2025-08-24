import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Developers portal',
  tagline: 'High-Quality Payment Processing for High-Risk Businesses',
  url: 'https://developers.bitzone.space',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'bitzone',
  projectName: 'developers',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/bitzone',
        },
        blog: false,
        theme: { customCss: [] },
        sitemap: { changefreq: 'weekly', priority: 0.5 },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Bitzone',
      logo: { alt: 'Bitzone', src: 'img/logo-bitzone.svg' },
      items: [],
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    colorMode: { defaultMode: 'dark', respectPrefersColorScheme: false },
  },
};

export default config;
