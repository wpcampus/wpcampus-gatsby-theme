import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { AuthorCards } from "../components/author"

// @TODO add filters for university?
// @TODO replace/merge with subject matter experts directory?
export default function Template(props) {
	const crumbs = {
		crumb: {
			path: props.path,
			text: "Contributors",
		},
		parent_element: {
			crumb: {
				path: "/about/",
				text: "About"
			}
		}
	}
	return (
		<Layout heading="Contributors" crumbs={crumbs} path={props.path}>
			<AuthorCards authors={props.data.allWordpressWpcContributors.nodes} />
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
    allWordpressWpcContributors {
		nodes {
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
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
