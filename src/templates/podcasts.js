import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { PodcastCallout, PodcastActions } from "../components/podcast"
import { ArticleArchive } from "../components/archive"

export default function Template(props) {
	const crumbs = {
		crumb: {
			path: props.path,
			text: "Podcast"
		}
	}

	// @TODO add meta description?

	const layoutAttr = {
		heading: "The WPCampus Podcast",
		crumbs: crumbs,
		path: props.path,
	}

	return (
		<Layout {...layoutAttr}>
			<PodcastCallout />
			<PodcastActions />
			<ArticleArchive list={props.data.allWordpressWpPodcast.edges} />
		</Layout>
	)
}

Template.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressWpPodcast(
      filter: {
		  status: { eq: "publish" },
		  wpc_gatsby: { disable: { eq: false } }
	  }
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
			path
			display_name
			email
			twitter
			website
			company
			company_position
			bio
          }
          title
		  type
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
        siteName
      }
    }
  }
`
