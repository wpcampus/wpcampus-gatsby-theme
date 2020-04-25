import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import CategoryTemplate from "./category"

const CategoryPost = ({ path, data, pageContext }) => {
	const context = pageContext
	const category = context.category
	const pageTitle = `Blog posts about ${category.name}`
	return (
		<CategoryTemplate
			pageTitle={pageTitle}
			path={path}
			crumbs={context.crumbs}
			category={category}
			categoryArchive={data.allWordpressPost.edges}
		/>
	)
}

CategoryPost.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired
}

export default CategoryPost

// @TODO remove fields we're not using.
export const query = graphql`
  query($id: String!) {
    allWordpressPost(
      filter: {
        status: { eq: "publish" }
        categories: { elemMatch: { id: { eq: $id } } },
		wpc_gatsby: { disable: { eq: false } }
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
        siteName
      }
    }
  }
`
