import React from "react"
import PropTypes from "prop-types"

import { Nav } from "../components/nav"

const Crumbs = ({ classes, crumbs }) => {

	const breadcrumbs = []

	let node = crumbs
	while (node && node.path && node.title) {

		breadcrumbs.push({ slug: node.path, text: node.title })

		if (node.parent_element) {
			node = node.parent_element
		} else {
			node = false
			break
		}
	}

	if (!breadcrumbs.length) {
		return null
	}

	// Always add home crumb.
	breadcrumbs.push({ slug: "/", text: "Home" })

	breadcrumbs.reverse()

	const navAttr = {
		classes: "wpc-crumbs",
		label: "Breadcrumbs",
		list: breadcrumbs
	}

	if (classes) {
		navAttr.classes += ` ${classes}`
	}

	return (
		<Nav {...navAttr} />
	)
}

Crumbs.propTypes = {
	classes: PropTypes.string,
	crumbs: PropTypes.object.isRequired
}

export default Crumbs
