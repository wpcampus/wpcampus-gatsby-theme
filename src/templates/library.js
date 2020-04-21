import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import LibraryLayout from "../components/library"

import "../css/library.css"

const Library = props => {
	const page = props.data.wordpressPage
	const library = props.data.allWordpressWpcLibrary.edges
	return <Layout heading={page.title} sidebarBottom={true} crumbs={props.pageContext.crumbs} path={props.path}>
		<div>{ReactHtmlParser(page.content)}</div>
		<LibraryLayout library={library} />
	</Layout>
}

Library.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired,
	edges: PropTypes.array,
}

export default Library

// @TODO remove fields we're not using.
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
				author {
					path
					bio
					company
					company_position
					display_name
					email
					id
					twitter
					website
					wordpress_id
				}
				speakers {
					avatar
					ID
					company
					company_website
					company_position
					content {
						raw
						rendered
					}
					display_name
					excerpt {
						raw
						rendered
					}
					facebook
					first_name
					headshot
					instagram
					last_name
					linkedin
					permalink
					post_date
					post_date_gmt
					title
					twitter
					website
					wordpress_user
				}
				best_session
				comment_count
				content {
					raw
					rendered
				}
				discussion
				event_date
				event_date_gmt
				event_name
				event_permalink
				event_slug
				excerpt {
					raw
					rendered
				}
				format
				format_name
				format_slug
				future
				permalink
				session_slides_url
				session_video
				session_video_url
				slug
				subjects
				title
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
