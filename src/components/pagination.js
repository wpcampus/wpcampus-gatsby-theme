import React from "react"
import PropTypes from "prop-types"
import { Nav } from "../components/nav"

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

export default PostPagination
