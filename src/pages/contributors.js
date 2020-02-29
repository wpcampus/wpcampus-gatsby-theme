import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { AuthorArchive } from "../components/archive"

export default function Template({ data }) {
	return (
		<Layout heading="Contributors">
			<AuthorArchive list={data.allWordpressWpUsers.edges} />
		</Layout>
	)
}

Template.propTypes = {
	data: PropTypes.object.isRequired
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
