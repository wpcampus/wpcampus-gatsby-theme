import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { CategoryArchive } from "../components/archive"

export default function Template({ data }) {
  return (
    <Layout heading="Categories">
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
