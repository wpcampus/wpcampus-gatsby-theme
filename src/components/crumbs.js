import React from "react"
import PropTypes from "prop-types"

import { Nav } from "../components/nav"

const Crumbs = ({ classes }) => {

	const breadcrumbs = [
		{ slug: "/", text: "Home" },
		{ slug: "/blognew/", text: "Blog" },
		{ slug: "/categories", text: "Categories" }
	]

	const navAttr = {
		classes: "wpc-crumbs",
		label: "Breadcrumbs",
		list: breadcrumbs
	}

	if ( classes ) {
		navAttr.classes += ` ${classes}`
	}

	return (
		<Nav {...navAttr} />
	)
}

Crumbs.propTypes = {
	classes: PropTypes.string
}

export default Crumbs
