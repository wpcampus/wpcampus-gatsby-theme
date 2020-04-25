import React from "react"
import PropTypes from "prop-types"
import { Nav } from "../components/nav"

import { ArrowLeft, ArrowRight } from "../svg/arrows"

const PaginationAdjacent = ({ single, previous, next }) => {
	let classes = "wpc-pagination-adj"
	let items = []
	if (previous) {
		const label = <span className="wpc-pagination-adj__label">
			<ArrowLeft /> <span>{previous.title || previous.name}</span>
		</span>
		classes += " wpc-pagination-adj--prev"
		items.push({
			classes: "wpc-pagination-adj__prev",
			path: previous.path,
			text: label,
			aria_label: `Previous ${single}: ` + (previous.title || previous.name),
		})
	}
	if (next) {
		const label = <span className="wpc-pagination-adj__label">
			<span>{next.title || next.name}</span> <ArrowRight />
		</span>
		classes += " wpc-pagination-adj--next"
		items.push({
			classes: "wpc-pagination-adj__next",
			path: next.path,
			text: label,
			aria_label: `Next ${single}: ` + (next.title || next.name),
		})
	}
	if (items) {
		const navAttr = {
			classes: classes,
			aria_label: "Pagination",
			list: items
		}
		return <Nav {...navAttr} />
	}
	return null
}

PaginationAdjacent.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
	single: PropTypes.string
}

const CategoryPaginationAdjacent = ({ previous, next }) => {
	return <PaginationAdjacent single="category" previous={previous} next={next} />
}

CategoryPaginationAdjacent.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

const PostPaginationAdjacent = ({ previous, next }) => {
	return <PaginationAdjacent single="post" previous={previous} next={next} />
}

PostPaginationAdjacent.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

const PodcastPaginationAdjacent = ({ previous, next }) => {
	return <PaginationAdjacent single="podcast" previous={previous} next={next} />
}

PodcastPaginationAdjacent.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

export { CategoryPaginationAdjacent, PodcastPaginationAdjacent, PostPaginationAdjacent }
