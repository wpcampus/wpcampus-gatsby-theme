import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import SEO from "../components/seo"

const PageTemplate = props => {
  const post = props.data.wordpressPage

  return (
    <Layout>
      <SEO title={post.title} />
      <NavPrimary />
      <h1>{post.title}</h1>
      <div>{ReactHtmlParser(post.content)}</div>
    </Layout>
  )
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default PageTemplate

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      id
      wordpress_id
      slug
      author {
        id
        wordpress_id
        name
        slug
        path
        url
      }
      date
      title
      status
      excerpt
      content
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
