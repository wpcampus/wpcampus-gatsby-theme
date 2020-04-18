import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"

const CategoryTemplate = props => {
	const category = props.data.wordpressCategory
	const context = props.pageContext
	const pageTitle = category.name
	return (
		<Layout pageTitle={pageTitle} crumbs={context.crumbs} path={props.path}>
			<span className="wpc-article-prefix">From our blog:</span>
			<h1>{category.name}</h1>
			{category.description ? <p>{category.description}</p> : ""}
			<ArticleArchive list={props.data.allWordpressPost.edges} />
		</Layout>
	)
}

CategoryTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default CategoryTemplate

// @TODO remove fields we're not using.
export const query = graphql`
  query($id: String!) {
    wordpressCategory(id: { eq: $id }) {
      id
      wordpress_id
      count
      name
      description
      path
    }
    allWordpressPost(
      filter: {
        type: { eq: "post" }
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
