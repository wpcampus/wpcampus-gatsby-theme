import React from "react"
import PropTypes from "prop-types"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-web-components")
}

const allowedComponents = ["wpcampus-library", "wpcampus-notifications", "wpcampus-coc"]

const WebComponent = ({ id, classes, tag }) => {
	if (!allowedComponents.includes(tag)) {
		return null
	}
	let markup = `<${tag}></${tag}>`
	const attr = {
		className: `wpc-component wpc-component--${id}`,
		dangerouslySetInnerHTML: {
			__html: markup,
		}
	}
	if (classes) {
		attr.className += ` ${classes}`
	}
	return (
		<div {...attr}></div>
	)
}

WebComponent.propTypes = {
	id: PropTypes.string.isRequired,
	classes: PropTypes.string,
	tag: PropTypes.string.isRequired,
}

// Will keep component from re-rendering
function dontRender() {
	return true
}

export default React.memo(WebComponent, dontRender)
