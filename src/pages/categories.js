import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { CategoryArchive } from "../components/archive"
import { NavPrimary } from "../components/nav"

export default function Template({ data }) {
  return (
    <Layout>
      <SEO title="Categories" />
      <h1>Categories</h1>
      <NavPrimary />
      <CategoryArchive list={data.allWordpressCategory.edges} />
    </Layout>
  )
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressCategory {
      edges {
        node {
          id
          wordpress_id
          count
          name
          description
          path
          parent {
            ... on wordpress__CATEGORY {
              id
              id
              wordpress_id
              count
              name
              path
            }
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
