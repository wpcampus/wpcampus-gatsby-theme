import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import Article from "../components/article"
import Layout from "../components/layout"
import { PodcastPaginationAdjacent } from "../components/pagination"

import "./../css/post.css"

const normalizeCategories = (categories) => {
	if (!categories) {
		return categories
	}
	return categories.map(category => {
		category.path = `/podcast/categories/${category.slug}`
		category.aria_label = `Podcast category: ${category.name}`
		return category
	})
}

const PodcastTemplate = props => {
	const podcast = props.data.wordpressWpPodcast
	const context = props.pageContext
	podcast.categories = normalizeCategories(podcast.categories)
	const paginationAdj = (
		<PodcastPaginationAdjacent previous={context.previous} next={context.next} />
	)
	const layoutAttr = {
		classes: "wpc-post",
		pageTitle: podcast.title,
		path: props.path
	}
	const articleAttr = {
		data: podcast, 
		wpc_protected: context.wpc_protected,
		isSingle: true,
		displayContentFull: true,
		headerPrefix: <Link to="/podcast/">From our podcast</Link>,
		paginationAdj: paginationAdj
	}
	return (
		<Layout {...layoutAttr}>
			<Article {...articleAttr}>
				<p>Duration: {podcast.meta.duration}</p>
			</Article>
		</Layout>
	)
}

PodcastTemplate.propTypes = {
	path: PropTypes.string.isRequired,
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
		path
		display_name
		email
		twitter
		website
		company
		company_position
		bio
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
        slug
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
