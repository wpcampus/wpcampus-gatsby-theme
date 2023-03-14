import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import CategoryTemplate from "./category"

const CategoryDirectors = ({ path, data, pageContext }) => {
	const context = pageContext
	const pageTitle = "Community Blog posts about Board of Directors"
	return (
		<CategoryTemplate
			pageTitle={pageTitle}
			path={path}
			crumbs={context.crumbs}
			category={context.categoryMain}
			categoryArchive={data.allWordpressPost.edges}
		/>
	)
}

CategoryDirectors.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired
}

export default CategoryDirectors

// @TODO remove fields we're not using.
export const query = graphql`
  query($categories: [Int!]) {
    allWordpressPost(
      filter: {
        status: { eq: "publish" }
        categories: { elemMatch: { wordpress_id: { in: $categories } } },
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
