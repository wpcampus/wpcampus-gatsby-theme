import React from "react"
import PropTypes from "prop-types"

import Article from "../components/article"

const Archive = ({ list }) =>
  list.map(({ node }) => (
    <Article
      key={node.id}
      data={node}
      isSingle={false}
      displayContent={true}
      displayContentFull={false}
    />
  ))

Archive.propTypes = {
  list: PropTypes.array.isRequired,
}

export default Archive
