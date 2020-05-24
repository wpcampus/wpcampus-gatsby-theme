import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import Iframe from "../components/iframe"
import ProtectedContent from "../components/content"

const isDev = "development" === process.env.NODE_ENV

const PageTemplate = props => {
	const page = props.data.wordpressPage
	const pageContext = props.pageContext

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		metaRobots: page.wpc_seo.meta.robots || [],
		heading: page.title,
		crumbs: pageContext.crumbs,
		path: props.path
	}

	const forms = pageContext.forms || []
	const formSrc = forms.length ? forms[0] : null

	const iframeAttr = {
		src: formSrc,
		origins: [pageContext.formOrigin],
		resizeLog: isDev
	}

	return (
		<Layout {...layoutAttr}>
			<ProtectedContent wpc_protected={pageContext.wpc_protected}>
				<div>{ReactHtmlParser(page.content)}</div>
				{formSrc && <Iframe {...iframeAttr} />}
			</ProtectedContent>
		</Layout>
	)
}

PageTemplate.propTypes = {
	pageContext: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
	path: PropTypes.string.isRequired,
}

export default PageTemplate

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        siteName
      }
	}
	wordpressPage(id: { eq: $id }) {
		id
		title
		content
		wpc_seo {
			title
			meta {
				description
				robots
			}
		}
	}
  }
`