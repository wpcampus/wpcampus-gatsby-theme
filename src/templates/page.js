import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import SEO from "../components/seo"
import Content from "../components/content"
import ReactHtmlParser from "react-html-parser"

const PageTemplate = props => {
  const page = props.data.wordpressPage
  const pageContext = props.pageContext

  return (
    <Layout>
      <SEO title={page.title} />
      <NavPrimary />
      <h1>{page.title}</h1>
      <Content wpc_protected={pageContext.wpc_protected}>
        <div>{ReactHtmlParser(page.content)}</div>
      </Content>
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
