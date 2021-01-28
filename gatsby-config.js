require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
	siteMetadata: {
		siteUrl: `${process.env.WPC_PUBLIC}/`,
		siteName: "WPCampus: Where WordPress meets higher education",
		description: "WPCampus is a community of web professionals, educators, and people dedicated to advancing higher education by providing support, resources, and training focused on open source web publishing technologies.",
		locale: "en_US",
		twitter: "@wpcampusorg",
	},
	plugins: [
		"gatsby-plugin-remove-generator",
		"gatsby-plugin-react-helmet",
		{
			resolve: "gatsby-plugin-react-helmet-canonical-urls",
			options: {
				siteUrl: process.env.WPC_PUBLIC,
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: "gatsby-plugin-google-analytics",
			options: {
				trackingId: "UA-73440483-2",
			},
		},
		{
			resolve: "gatsby-plugin-sitemap",
			options: {
				exclude: [
					"/404/",
					"/account/",
					"/callback/",
					"/login/",
					"/pages/",
					"/search/*",
				]
			}
		},
		{
			resolve: "gatsby-plugin-robots-txt",
			options: {
				env: {
					host: process.env.WPC_PUBLIC,
					sitemap: `${process.env.WPC_PUBLIC}/sitemap.xml`,
					development: {
						policy: [{ userAgent: "*", disallow: ["/"] }]
					},
					production: {
						policy: [{ userAgent: "*", allow: "/" }]
					}
				}
			}
		},
		"gatsby-transformer-sharp",
		"gatsby-plugin-sharp",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				name: "gatsby-starter-default",
				short_name: "starter",
				start_url: "/",
				background_color: "#ffffff",
				theme_color: "#2e3641",
				display: "minimal-ui",
				icon: "src/svg/wpcampus-favicon.svg",
			},
		},
		{
			resolve: "gatsby-plugin-postcss",
			options: {
				postCssPlugins: [require("autoprefixer")(), require("postcss-nested")],
			},
		},
		{
			resolve: "gatsby-source-wordpress",
			options: {
				baseUrl: process.env.GATSBY_WPC_WORDPRESS,
				protocol: "https",
				hostingWPCOM: false,
				useACF: false,
				minimizeDeprecationNotice: true,
				includedRoutes: [
					"**/posts",
					"**/pages",
					"**/categories",
					"**/podcast",
					//"**/members", // @TODO security concern?
				],
				auth: {
					htaccess_user: process.env.WPC_JWT_USER,
					htaccess_pass: process.env.WPC_JWT_PASSWORD,
				},
			},
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	],
}
