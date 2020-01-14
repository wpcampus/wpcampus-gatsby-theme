import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Article from "../components/article"
import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import PostPagination from "../components/pagination"
import SEO from "../components/seo"

const PostTemplate = props => {
  const post = props.data.wordpressPost
  const context = props.pageContext
  const pagination = (
    <PostPagination previous={context.previous} next={context.next} />
  )
  return (
    <Layout>
      <SEO title={post.title} />
      <NavPrimary />
      {pagination}
      <Article data={post} isSingle={true} displayContentFull={true} />
      {pagination}
    </Layout>
  )
}

PostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default PostTemplate

// @TODO remove fields we're not using.
export const postQuery = graphql`
  query($id: String!) {
    wordpressPost(id: { eq: $id }) {
      id
      wordpress_id
      slug
      path
      author
      title
      status
      date
      dateFormatted: date(formatString: "MMMM D, YYYY")
      excerpt
      content
      comment_status
      categories
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
