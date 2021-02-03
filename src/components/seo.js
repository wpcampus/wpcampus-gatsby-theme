/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO(
	{
		description,
		lang,
		meta,
		title,
		useTitleTemplate,
		metaRobots,
		htmlClass
	}) {
	const { site } = useStaticQuery(
		graphql`
      		query {
        		site {
          			siteMetadata {
						siteUrl
						siteName
						description
						locale
						twitter
						feeds {
							main
							planning
						}
					}
        		}
			  }
		`
	)

	const metaDescription = description || site.siteMetadata.description

	// @TODO add new twitter/og image
	const og_image = "https://wpcampus.org/wp-content/uploads/WPCampus-graphic-header.png"
	const og_image_width = "1200"
	const og_image_height = "628"

	const htmlAttributes = {
		lang: lang,
	}

	if (htmlClass) {
		htmlAttributes.class = htmlClass
	}

	const helmetAttr = {
		htmlAttributes: htmlAttributes,
		title: title,
	}

	if (useTitleTemplate) {
		title = `${title} | ${site.siteMetadata.siteName}`
		helmetAttr.titleTemplate = `%s | ${site.siteMetadata.siteName}`
	}

	// Create meta.
	const helmetMeta = [
		{
			name: "description",
			content: metaDescription,
		},
		{
			property: "og:site_name",
			content: site.siteMetadata.siteName
		},
		{
			property: "og:url",
			content: site.siteMetadata.siteUrl,
		},
		{
			property: "og:title",
			content: title,
		},
		{
			property: "og:description",
			content: metaDescription,
		},
		{
			property: "og:locale",
			content: site.siteMetadata.locale
		},
		{
			property: "og:type",
			content: "website",
		},
		{
			property: "og:image",
			content: og_image
		},
		{
			property: "og:image:secure_url",
			content: og_image
		},
		{
			property: "og:image:width",
			content: og_image_width
		},
		{
			property: "og:image:height",
			content: og_image_height
		},
		{
			name: "twitter:image",
			content: og_image
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:site",
			content: site.siteMetadata.twitter,
		},
		{
			name: "twitter:creator",
			content: site.siteMetadata.twitter,
		},
		{
			name: "twitter:title",
			content: title,
		},
		{
			name: "twitter:description",
			content: metaDescription,
		}
	]

	// Build robots meta.
	const robots = []

	if (metaRobots.includes("nofollow")) {
		robots.push("nofollow")
	} else {
		robots.push("follow")
	}

	if (metaRobots.includes("noindex")) {
		robots.push("noindex")
	} else {
		robots.push("index")
	}

	if (robots.length) {
		helmetMeta.push(
			{
				name: "robots",
				content: robots.join(","),
			})
	}

	// Add meta to helmet.
	helmetAttr.meta = helmetMeta.concat(meta)

	// @TODO audit font usage.
	return (
		<Helmet {...helmetAttr}>
			<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400&family=Roboto:wght@300&display=swap" rel="stylesheet" />
			<link rel="alternate" type="application/rss+xml" title="RSS Feed for WPCampus Community Blog" href={site.siteMetadata.feeds.main} />
			<link rel="alternate" type="application/rss+xml" title="RSS Feed for WPCampus Planning Blog" href={site.siteMetadata.feeds.planning} />
		</Helmet>
	)
}

SEO.defaultProps = {
	lang: "en",
	meta: [],
	description: "",
	useTitleTemplate: true,
	metaRobots: []
}

SEO.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.string.isRequired,
	useTitleTemplate: PropTypes.bool,
	metaRobots: PropTypes.array,
	htmlClass: PropTypes.string
}

export default SEO
