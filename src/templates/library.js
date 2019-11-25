import React, { Component } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import SEO from "../components/seo"

import "@wpcampus/wpcampus-web-components"

class Page extends Component {
  render() {
    const post = this.props.data.wordpressPage

    return (
      <Layout>
        <SEO title={post.title} />
        <NavPrimary />
        <h1>{post.title}</h1>
        <wpcampus-library></wpcampus-library>
        <div>{ReactHtmlParser(post.content)}</div>
      </Layout>
    )
  }
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default Page

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      id
      wordpress_id
      slug
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
