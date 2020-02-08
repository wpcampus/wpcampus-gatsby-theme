import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { AuthorArchive } from "../components/archive"
import { NavPrimary } from "../components/nav"

export default function Template({ data }) {
  return (
    <Layout heading="Contributors">
      <NavPrimary />
      <AuthorArchive list={data.allWordpressWpUsers.edges} />
    </Layout>
  )
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressWpUsers {
      edges {
        node {
          id
          wordpress_id
          name
          slug
          path
          url
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
