import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

import "./../css/home.css"

const PageTemplate = props => {
	const page = props.data.wordpressPage

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		isHome: true,
		pageTitle: page.title,
		useTitleTemplate: false,
		heading: page.title,
		path: props.path
	}

	return (
		<Layout{...layoutAttr}>
			<div>{ReactHtmlParser(page.content)}</div>
		</Layout>
	)
}

PageTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired
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
