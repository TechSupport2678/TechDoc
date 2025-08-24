// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Developers portal',
	tagline: 'High-Quality Payment Processing for High-Risk Businesses',
	url: 'https://techsupport2678.github.io',
	baseUrl: '/TechDoc/',
	favicon: 'img/favicon.ico',
	organizationName: 'TechSupport2678',
	projectName: 'TechDoc',
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
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/TechSupport2678/TechDoc/tree/main/',
				},
				blog: false,
				theme: { customCss: require.resolve('./src/css/custom.css') },
				sitemap: { changefreq: 'weekly', priority: 0.5 },
			},
		],
	],
	themeConfig: {
		navbar: {
			title: 'PandaPay',
			logo: { alt: 'PandaPay', src: 'img/logo-pandapay.svg' },
			items: [],
		},
		prism: {},
		colorMode: { defaultMode: 'dark', respectPrefersColorScheme: false },
	},
};

module.exports = config;