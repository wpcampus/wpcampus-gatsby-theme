import React from "react"
import PropTypes from "prop-types"

const Heading = ({ level, heading, classes }) => {
	if (!level || level < 1 || level > 6) {
		level = 1
	}
	const ElementName = `h${level}`
	const elementAttr = {}
	if (classes) {
		elementAttr.className = classes
	}
	return (
		<ElementName {...elementAttr}>{heading}</ElementName>
	)
}

Heading.propTypes = {
	level: PropTypes.number.isRequired,
	heading: PropTypes.string.isRequired,
	classes: PropTypes.string
}

export default Heading
