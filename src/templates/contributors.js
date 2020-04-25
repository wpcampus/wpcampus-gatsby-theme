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
	const contributors = props.data.allWordpressWpcContributors.nodes

	// @TODO add meta description?

	return (
		<Layout heading="Contributors" crumbs={crumbs} path={props.path}>
			<p>At WPCampus, our mission is to advance Higher Education by providing a support structure and wealth of knowledge for anyone who uses, or is interested in using, WordPress in the world of Higher Education.</p>
			<p>Our community is grateful to the <strong>{contributors.length} volunteer contributors</strong> who have donated their time, energy, and skills to provide content and resources in support of our mission.</p>
			<p><em>Note:</em> We are working on a plan to highlight those who contribute to our community in other ways, for example, donating their time to organize events and lead committees and working groups. We have a wonderful, giving community and we are so grateful to all who foster its growth.</p>
			<AuthorCards authors={contributors} displayBio={false} classes="wpc-contributors--archive" />
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
        siteName
      }
    }
  }
`
