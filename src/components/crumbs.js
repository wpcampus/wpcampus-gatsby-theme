import React from "react"
import PropTypes from "prop-types"

import Nav from "../components/nav"

const Crumbs = ({ classes }) => {

	const breadcrumbs = [
		{ slug: "/", text: "Home" },
		{
			slug: "/blog/",
			text: "Blog",
			children: [{ slug: "/categories", text: "Categories" }],
		},
		{ slug: "/pages/", text: "Pages" },
		{ slug: "/contributors/", text: "Contributors" },
	]

	return (
		<Nav list={breadcrumbs} classes={classes} label="Breadcrumbs" />
	)
}

Crumbs.propTypes = {
	classes: PropTypes.string
}

export default Crumbs
