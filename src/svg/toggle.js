import React from "react"
import PropTypes from "prop-types"

const ToggleIcon = ({ classes }) => {
	const svgAttr = {}
	if (classes) {
		svgAttr.className = classes
	}
	return (
		<div {...svgAttr}>
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 18">
				<rect x="0" y="0" />
				<rect x="0" y="8" />
				<rect x="0" y="16" />
			</svg>
		</div>
	)
}

ToggleIcon.propTypes = {
	classes: PropTypes.string
}

export default ToggleIcon
