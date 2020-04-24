import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { CategoryArchive } from "../components/archive"

function sortByNameAsc(a, b) {
	if (a.name < b.name) {
		return -1
	}
	if (a.name > b.name) {
		return 1
	}
	return 0
}

export default function Template(props) {
	const context = props.pageContext
	const categories = context.categories.sort(sortByNameAsc)

	// @TODO add meta description?

	return (
		<Layout heading={context.heading} crumbs={context.crumbs} path={props.path}>
			<CategoryArchive list={categories} />
		</Layout>
	)
}

Template.propTypes = {
	path: PropTypes.string.isRequired,
	pageContext: PropTypes.object.isRequired
}

// @TODO remove fields we're not using.
export const query = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`
