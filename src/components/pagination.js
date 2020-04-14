import React from "react"
import PropTypes from "prop-types"
import { Nav } from "../components/nav"

const Pagination = ({ path, single, plural, previous, next }) => {
	let items = [
		{
			path: path,
			text: `All ${plural}`,
		},
	]
	if (previous) {
		items.push({
			path: previous.path,
			text: `Previous ${single}: ` + (previous.title || previous.name),
		})
	}
	if (next) {
		items.push({
			path: next.path,
			text: `Next ${single}: ` + (next.title || next.name),
		})
	}
	if (items) {
		return <Nav list={items} />
	}
	return null
}

const CategoryPagination = ({ previous, next }) => {
	return <Pagination path="/blog/categories/" single="category" plural="categories" previous={previous} next={next} />
}

const PostPagination = ({ previous, next }) => {
	return <Pagination path="/blog/" single="post" plural="posts" previous={previous} next={next} />
}

const PodcastPagination = ({ previous, next }) => {
	return <Pagination path="/podcast/" single="podcast" plural="podcasts" previous={previous} next={next} />
}

Pagination.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
	path: PropTypes.string,
	single: PropTypes.string,
	plural: PropTypes.string
}

CategoryPagination.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

PostPagination.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

PodcastPagination.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
}

export { Pagination, CategoryPagination, PodcastPagination, PostPagination }
