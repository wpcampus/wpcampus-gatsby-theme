import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Article from "../components/article"
import Layout from "../components/layout"
import { PodcastPagination } from "../components/pagination"

const PodcastTemplate = props => {
	const podcast = props.data.wordpressWpPodcast
	const context = props.pageContext
	const pagination = (
		<PodcastPagination previous={context.previous} next={context.next} />
	)
	return (
		<Layout pageTitle={podcast.title}>
			{pagination}
			<p>Duration: {podcast.meta.duration}</p>
			<Article data={podcast} wpc_protected={context.wpc_protected} isSingle={true} displayContentFull={true} />
			{pagination}
		</Layout>
	)
}

PodcastTemplate.propTypes = {
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default PodcastTemplate

// @TODO remove fields we're not using.
export const podcastQuery = graphql`
  query($id: String!) {
    wordpressWpPodcast(id: { eq: $id }) {
      id
      wordpress_id
      slug
      path
      author {
        id
        wordpress_id
        name
        slug
        path
		url
		description
		company
		company_position
		twitter
      }
      title
      status
      date
      dateFormatted: date(formatString: "MMMM D, YYYY")
      excerpt
      content
      comment_status
      categories {
        id
        wordpress_id
        count
        name
        description
        path
	  }
	  meta {
		  duration
	  }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
