import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { AuthorCards } from "../components/author"

// @TODO add filters for university?
// @TODO replace/merge with subject matter experts directory?
export default function Template({ data }) {
	return (
		<Layout heading="Contributors">
			<AuthorCards authors={data.allWordpressWpUsers.nodes} />
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
		nodes {
			id
			wordpress_id
			name
			slug
			path
			url
			description
			company
			company_position
			twitter
		}
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
