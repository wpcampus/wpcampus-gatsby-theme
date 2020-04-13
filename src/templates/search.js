import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SearchLayout from "../components/searchLayout"

const SearchTemplate = (props) => {
	const crumbs = {
		path: "/search/",
		title: "Search",
	}
	return (
		<Layout heading="Search" crumbs={crumbs} path={props.path}>
			<p>If you can&lsquo;t find what you&lsquo;re looking for, please <Link to="/about/contact" aria-label="Contact us and let us know">let us know</Link>.</p>
			<SearchLayout />
		</Layout>
	)
}

SearchTemplate.propTypes = {
	path: PropTypes.string.isRequired
}

export default SearchTemplate