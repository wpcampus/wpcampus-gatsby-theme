import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import CategoryTemplate from "./category"

const CategoryPodcast = ({ path, data, pageContext }) => {
	const context = pageContext
	const category = context.category
	const pageTitle = `Podcasts about ${category.name}`
	return (
		<CategoryTemplate
			pageTitle={pageTitle}
			path={path}
			crumbs={context.crumbs}
			category={category}
			categoryArchive={data.allWordpressWpPodcast.edges}
		/>
	)
}

CategoryPodcast.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired
}

export default CategoryPodcast

// @TODO remove fields we're not using.
export const query = graphql`
  query($id: String!) {
    allWordpressWpPodcast(
      filter: {
        status: { eq: "publish" }
        categories: { elemMatch: { id: { eq: $id } } }
      }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
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
            path
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
