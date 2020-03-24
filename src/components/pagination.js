import React from "react"
import PropTypes from "prop-types"
import Nav from "../components/nav"

const Pagination = ({ slug, single, plural, previous, next }) => {
	let items = [
		{
			slug: `/${slug}`,
			text: `All ${plural}`,
		},
	]
	if (previous) {
		items.push({
			slug: previous.path,
			text: `Previous ${single}: ` + (previous.title || previous.name),
		})
	}
	if (next) {
		items.push({
			slug: next.path,
			text: `Next ${single}: ` + (next.title || next.name),
		})
	}
	if (items) {
		return <Nav list={items} />
	}
	return null
}

const CategoryPagination = ({ previous, next }) => {
	return <Pagination slug="categories" single="category" plural="categories" previous={previous} next={next} />
}

const PostPagination = ({ previous, next }) => {
	return <Pagination slug="blog" single="post" plural="posts" previous={previous} next={next} />
}

const PodcastPagination = ({ previous, next }) => {
	return <Pagination slug="podcast" single="podcast" plural="podcasts" previous={previous} next={next} />
}

Pagination.propTypes = {
	previous: PropTypes.object,
	next: PropTypes.object,
	slug: PropTypes.string,
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
