import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Archive from "../components/archive"
import { NavPrimary } from "../components/nav"

export default function Template({ data }) {
  return (
    <Layout>
      <SEO title="Blog" />
      <h1>Blog posts</h1>
      <NavPrimary/>
      <Archive list={data.allWordpressPost.edges} />
    </Layout>
  )
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressPost(
      filter: { type: { eq: "post" } }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
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
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
