require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
	siteMetadata: {
		siteUrl: process.env.WPC_ROOT,
		title: "WPCampus: Where WordPress meets Higher Education",
		description: "WPCampus is a community of web professionals, educators, and people dedicated to advancing Higher Education by providing support, resources, and training focused on open source web publishing technologies.",
		author: "@wpcampusorg",
	},
	plugins: [
		"gatsby-plugin-react-helmet",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: "gatsby-plugin-sitemap",
			options: {}
		},
		{
			resolve: "gatsby-plugin-robots-txt",
			options: {
				env: {
					host: process.env.WPC_ROOT,
					sitemap: `${process.env.WPC_ROOT}/sitemap.xml`,
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
				background_color: "#663399",
				theme_color: "#663399",
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
				baseUrl: process.env.WPC_HOST,
				protocol: "https",
				hostingWPCOM: false,
				useACF: false,
				includedRoutes: [
					"**/posts",
					"**/pages",
					"**/categories",
					"**/podcast",
					//"**/members", // @TODO security concern?
				],
				auth: {
					jwt_user: process.env.WPC_JWT_USER,
					jwt_pass: process.env.WPC_JWT_PASSWORD,
				},
			},
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	],
}
