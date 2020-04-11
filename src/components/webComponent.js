import React from "react"
import PropTypes from "prop-types"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-web-components")
}

const allowedComponents = ["wpcampus-library", "wpcampus-notifications", "wpcampus-blog", "wpcampus-conduct", "wpcampus-footer"]

const WebComponent = ({ id, classes, tag }) => {
	if (!allowedComponents.includes(tag)) {
		return null
	}
	let Tag = tag
	const attr = {}
	if (id) {
		attr.id = id
	}
	if (classes) {
		attr.className = classes
	}
	return (
		<Tag {...attr}></Tag>
	)
}

WebComponent.propTypes = {
	id: PropTypes.string,
	classes: PropTypes.string,
	tag: PropTypes.string.isRequired,
}

// Will keep component from re-rendering
function dontRender() {
	return true
}

export default React.memo(WebComponent, dontRender)
