import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { ArticleArchive } from "../components/archive"

export default function Template(props) {
	const crumbs = {
		crumb: {
			path: props.path,
			text: "Blog"
		}
	}

	// @TODO add meta description?

	return (
		<Layout pageTitle="Blog" heading="The WPCampus Blog" crumbs={crumbs} path={props.path}>
			<ArticleArchive list={props.data.allWordpressPost.edges} />
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
    allWordpressPost(
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
