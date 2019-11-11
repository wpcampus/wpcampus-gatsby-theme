import React, { Component } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Article from "../components/article"
import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import SEO from "../components/seo"

class Post extends Component {
  render() {
    const post = this.props.data.wordpressPost
    return (
      <Layout>
        <SEO title={post.title} />
        <NavPrimary />
        <Article data={post} isSingle={true} displayContentFull={true} />
      </Layout>
    )
  }
}

Post.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default Post

// @TODO remove fields we're not using.
export const postQuery = graphql`
  query($id: String!) {
    wordpressPost(id: { eq: $id }) {
      id
      wordpress_id
      slug
      path
      title
      status
      date
      dateFormatted: date(formatString: "MMMM D, YYYY")
      excerpt
      content
      comment_status
      featured_media {
        wordpress_id
        alt_text
        caption
        title
        mime_type
        source_url
        localFile {
          relativePath
        }
      }
      categories {
        wordpress_id
        count
        name
        path
        link
      }
      author {
        wordpress_id
        name
        slug
        link
        path
        url
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
