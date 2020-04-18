import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

const Library = props => {
	const page = props.data.wordpressPage
	const library = props.data.allWordpressWpcLibrary.edges
	return <Layout heading={page.title} path={props.path}>
		<div>{ReactHtmlParser(page.content)}</div>
		{library.map(({ node }, i) => {
			return <div className="session" key={i}>
				<h2><a href={node.permalink}>{node.title}</a></h2>
				<h3>{node.event_name}</h3>
				<div>{ReactHtmlParser(node.content.rendered)}</div>
			</div>
		})}
	</Layout>
}

Library.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
}

export default Library

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
	allWordpressWpcLibrary(
		sort: { fields: event_date, order: DESC }
	  ) {
		edges {
		  	node {
				title
				permalink
				event_name
				content {
					rendered
				}
		  	}
		}
	}
    site {
      siteMetadata {
        title
      }
    }
  }
`
