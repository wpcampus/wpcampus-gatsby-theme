import React from "react"
import PropTypes from "prop-types"

if (typeof HTMLElement !== "undefined") {
  require("@wpcampus/wpcampus-web-components")
}

const allowedComponents = ["wpcampus-library", "wpcampus-notifications"]

const WebComponent = ({ tag }) => {
  if (!allowedComponents.includes(tag)) {
    return null
  }
  let markup = "<" + tag + "></" + tag + ">"
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: markup,
      }}
    />
  )
}

WebComponent.propTypes = {
  tag: PropTypes.string.isRequired,
}

// Will keep component from re-rendering
function dontRender(prevProps, nextProps) {
  return true
}

export default React.memo(WebComponent, dontRender)
