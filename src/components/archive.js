import React from "react"
import PropTypes from "prop-types"

import Article from "../components/article"

const Archive = ({ list, displayMeta, displayContent, displayContentFull }) =>
  list.map(({ node }) => (
    <Article
      key={node.id}
      data={node}
      isSingle={false}
      displayMeta={displayMeta}
      displayContent={displayContent}
      displayContentFull={displayContentFull}
    />
  ))

Archive.propTypes = {
  list: PropTypes.array.isRequired,
  displayMeta: PropTypes.bool,
  displayContent: PropTypes.bool,
  displayContentFull: PropTypes.bool,
}

Archive.defaultProps = {
  displayMeta: true,
  displayContent: true,
  displayContentFull: false,
}

export default Archive
