import React from "react"
import PropTypes from "prop-types"

const ToggleIcon = ({ classes }) => {
	const svgAttr = {}
	if (classes) {
		svgAttr.className = classes
	}
	return (
		<div {...svgAttr}>
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 20 20">
				<rect className="toggle-bar toggle-bar--one" x="0" y="0" width="20" height="2" />
				<rect className="toggle-bar toggle-bar--two" x="0" y="9" width="20" height="2" />
				<rect className="toggle-bar toggle-bar--three" x="0" y="18" width="20" height="2" />
				<rect className="toggle-bar toggle-bar--four" x="-3.2" y="9" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.1598 9.9927)" width="26.3" height="2" />
				<rect className="toggle-bar toggle-bar--five" x="9" y="-3.1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.1598 9.9926)" width="2" height="26.3" />
			</svg>
		</div>
	)
}

ToggleIcon.propTypes = {
	classes: PropTypes.string
}

export default ToggleIcon
