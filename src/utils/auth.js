import React from "react"
import PropTypes from "prop-types"

import { Link } from "gatsby"

// Displays the logout "button".
export const LogoutLink = ({ isPlain, isPrimary, redirectPath }) => {
	const buttonAttr = {
		to: "/logout/",
		className: "wpc-button wpc-button--logout",
	}
	if (isPrimary) {
		buttonAttr.className += " wpc-button--primary"
	} else if (isPlain) {
		buttonAttr.className += " wpc-button--plain"
	}
	if (redirectPath) {
		buttonAttr.state = { prevPath: redirectPath }
	}
	return <Link {...buttonAttr}>Logout</Link>
}

LogoutLink.propTypes = {
	isPlain: PropTypes.bool,
	isPrimary: PropTypes.bool,
	redirectPath: PropTypes.string,
}

LogoutLink.defaultProps = {
	isPlain: false,
	redirectPath: "/"
}