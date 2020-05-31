import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

import "../css/donors.css"

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

	return (
		<Layout {...layoutAttr}>
			<div>{ReactHtmlParser(page.content)}</div>
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
	  wpc_seo {
		  title
		  meta {
			  description
			  robots
		  }
	  }
    }
    site {
      siteMetadata {
        siteName
      }
    }
  }
`
