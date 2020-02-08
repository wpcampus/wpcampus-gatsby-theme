import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"
import { CategoryPagination } from "../components/pagination"

const CategoryTemplate = props => {
  const category = props.data.wordpressCategory
  const context = props.pageContext
  const pagination = (
    <CategoryPagination previous={context.previous} next={context.next} />
  )
  const heading = `Category: ${category.name}`
  return (
    <Layout heading={heading}>
      {category.description ? <p>{category.description}</p> : ""}
      {pagination}
      <ArticleArchive list={props.data.allWordpressPost.edges} />
      {pagination}
    </Layout>
  )
}

CategoryTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
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
            wordpress_id
            name
            slug
            path
            url
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
