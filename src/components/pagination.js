import React from "react"
import PropTypes from "prop-types"
import { Nav } from "../components/nav"

const CategoryPagination = ({ previous, next }) => {
  let items = [
    {
      slug: "/categories",
      text: `All categories`,
    },
  ]
  if (previous) {
    items.push({
      slug: previous.path,
      text: `Previous category: ` + previous.name,
    })
  }
  if (next) {
    items.push({
      slug: next.path,
      text: `Next category: ` + next.name,
    })
  }
  if (items) {
    return <Nav list={items} />
  }
  return null
}

CategoryPagination.propTypes = {
  previous: PropTypes.object,
  next: PropTypes.object,
}

const PostPagination = ({ previous, next }) => {
  let items = [
    {
      slug: "/blog",
      text: `All posts`,
    },
  ]
  if (previous) {
    items.push({
      slug: previous.path,
      text: `Previous post: ` + previous.title,
    })
  }
  if (next) {
    items.push({
      slug: next.path,
      text: `Next post: ` + next.title,
    })
  }
  if (items) {
    return <Nav list={items} />
  }
  return null
}

PostPagination.propTypes = {
  previous: PropTypes.object,
  next: PropTypes.object,
}

export { CategoryPagination, PostPagination }
