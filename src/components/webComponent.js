import React from "react"
import PropTypes from "prop-types"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-web-components")
}

const allowedComponents = ["wpcampus-library", "wpcampus-notifications", "wpcampus-blog", "wpcampus-conduct", "wpcampus-footer"]

const WebComponent = ({ id, type, classes, tag }) => {
	if (!allowedComponents.includes(tag)) {
		return null
	}
	let markup = `<${tag}></${tag}>`
	const attr = {
		className: `wpc-component wpc-component--${type}`,
		dangerouslySetInnerHTML: {
			__html: markup,
		}
	}
	if (id) {
		attr.id = id
	}
	if (classes) {
		attr.className += ` ${classes}`
	}
	return (
		<div {...attr}></div>
	)
}

WebComponent.propTypes = {
	id: PropTypes.string,
	type: PropTypes.string.isRequired,
	classes: PropTypes.string,
	tag: PropTypes.string.isRequired,
}

// Will keep component from re-rendering
function dontRender() {
	return true
}

export default React.memo(WebComponent, dontRender)
