import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"
import SEO from "../components/seo"
import ProtectedContent from "../components/content"

const MemberPageTemplate = props => {
  const page = props.data.wordpressWpMembers
  const pageContext = props.pageContext

  return (
    <Layout>
      <SEO title={page.title} />
      <NavPrimary />
      <h1>{page.title}</h1>
      <ProtectedContent wpc_protected={pageContext.wpc_protected}>
        <div>{ReactHtmlParser(page.content)}</div>
      </ProtectedContent>
    </Layout>
  )
}

MemberPageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default MemberPageTemplate

export const memberQuery = graphql`
  query($id: String!) {
    wordpressWpMembers(id: { eq: $id }) {
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
