import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { AuthorCards } from "../components/author"

// @TODO add filters for university?
// @TODO replace/merge with subject matter experts directory?
export default function Template(props) {
	const data = props.data
	const crumbs = {
		path: props.path,
		title: "Contributors",
		parent_element: {
			path: "/about/",
			title: "About"
		}
	}
	return (
		<Layout heading="Contributors" crumbs={crumbs}>
			<AuthorCards authors={data.allWordpressWpUsers.nodes} />
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
