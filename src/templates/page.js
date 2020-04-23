import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import ProtectedContent from "../components/content"

const PageTemplate = props => {
	const page = props.data.wordpressPage
	const pageContext = props.pageContext

	// @TODO short term fix to setup meta desc.
	const excerptDiv = document.createElement("div")
	excerptDiv.innerHTML = page.excerpt

	const layoutAttr = {
		metaDescription: excerptDiv.textContent || excerptDiv.innerText || "",
		heading: page.title,
		crumbs: pageContext.crumbs,
		path: props.path
	}

	return (
		<Layout {...layoutAttr}>
			<ProtectedContent wpc_protected={pageContext.wpc_protected}>
				<div>{ReactHtmlParser(page.content)}</div>
			</ProtectedContent>
		</Layout>
	)
}

PageTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default PageTemplate

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      id
      wordpress_id
      slug
      date
      title
      status
      excerpt
      content
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
