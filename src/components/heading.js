import React from "react"
import PropTypes from "prop-types"

const Heading = ({ level, heading }) => {
	if (!level || level < 1 || level > 6) {
		level = 1
	}
	const ElementName = `h${level}`
	return (
		<ElementName>{heading}</ElementName>
	)
}

Heading.propTypes = {
	level: PropTypes.number.isRequired,
	heading: PropTypes.string.isRequired,
}

export default Heading
