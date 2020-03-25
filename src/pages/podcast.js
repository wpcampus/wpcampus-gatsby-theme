import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { PodcastCallout, PodcastActions } from "../components/podcast"
import { ArticleArchive } from "../components/archive"

export default function Template({ data }) {
	return (
		<Layout pageTitle="Podcast" heading="Podcasts">
			<PodcastCallout />
			<PodcastActions />
			<ArticleArchive list={data.allWordpressWpPodcast.edges} />
		</Layout>
	)
}

Template.propTypes = {
	data: PropTypes.object.isRequired
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressWpPodcast(
      filter: { type: { eq: "podcast" }, status: { eq: "publish" } }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
          id
          wordpress_id
          slug
          path
          author {
            id
            wordpress_id
            name
            slug
            path
          }
          title
          status
          date
          dateFormatted: date(formatString: "MMMM D, YYYY")
          excerpt
          content
          comment_status
          categories {
            id
            wordpress_id
            count
            name
            description
            path
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