import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

const PageTemplate = props => {
	const page = props.data.wordpressPage
	return (
		<Layout isHome={true} pageTitle={page.title} useTitleTemplate={false} heading={page.title} path={props.path}>
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
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
