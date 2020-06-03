import React from "react"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"

const CategoryTemplate = ({ pageTitle, path, crumbs, category, categoryArchive }) => {

	// @TODO add meta description?

	const layoutAttr = {
		pageTitle: pageTitle,
		crumbs: crumbs,
		path: path,
	}

	return (
		<Layout {...layoutAttr}>
			<h1>{pageTitle}</h1>
			{category.description ? <p>{category.description}</p> : ""}
			<ArticleArchive list={categoryArchive} />
		</Layout>
	)
}

CategoryTemplate.propTypes = {
	pageTitle: PropTypes.string.isRequired,
	path: PropTypes.string,
	crumbs: PropTypes.array,
	category: PropTypes.object.isRequired,
	categoryArchive: PropTypes.array
}

export default CategoryTemplate
