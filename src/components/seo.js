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
		noIndex,
		noFollow
	}) {
	const { site } = useStaticQuery(
		graphql`
      		query {
        		site {
          			siteMetadata {
						title
						description
						author
					}
        		}
			  }
		`
	)

	const metaDescription = description || site.siteMetadata.description

	const helmetMeta = [
		{
			name: "description",
			content: metaDescription,
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
			property: "og:type",
			content: "website",
		},
		{
			name: "twitter:card",
			content: "summary",
		},
		{
			name: "twitter:creator",
			content: site.siteMetadata.author,
		},
		{
			name: "twitter:title",
			content: title,
		},
		{
			name: "twitter:description",
			content: metaDescription,
		},
	]

	const robots = []

	if (true === noIndex) {
		robots.push("noindex")
	}

	if (noFollow) {
		robots.push("nofollow")
	}

	if (robots.length) {
		helmetMeta.push(
			{
				property: "robots",
				content: robots.join(","),
			})
	}

	const helmetAttr = {
		htmlAttributes: {
			lang,
		},
		title: title,
		meta: helmetMeta.concat(meta)
	}

	if (useTitleTemplate) {
		helmetAttr.titleTemplate = `%s | ${site.siteMetadata.title}`
	}

	// @TODO audit font usage.
	return (
		<Helmet {...helmetAttr}>
			<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400&family=Roboto:wght@300&display=swap" rel="stylesheet" />
		</Helmet>
	)
}

SEO.defaultProps = {
	lang: "en",
	meta: [],
	description: "",
	useTitleTemplate: true,
	noIndex: false,
	noFollow: false
}

SEO.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.string.isRequired,
	useTitleTemplate: PropTypes.bool,
	noIndex: PropTypes.bool,
	noFollow: PropTypes.bool
}

export default SEO
