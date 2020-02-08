import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import WebComponent from "../components/webComponents"

const Library = props => {
  const page = props.data.wordpressPage
  return (
    <Layout heading={page.title}>
      <NavPrimary />
      <div>{ReactHtmlParser(page.content)}</div>
      <WebComponent tag="wpcampus-library" />
    </Layout>
  )
}

Library.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default Library

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
