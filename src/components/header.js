import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/header.css"

const Header = ({ siteTitle }) => {
	return (
		<header className="wpc-header wpc-wrapper">
			<div className="wpc-container">
				<h1 className="wpc-header__heading wpc-header__heading--site">
					<Link to="/">{siteTitle}</Link>
				</h1>
				<User.Consumer>{userDisplay}</User.Consumer>
			</div>
		</header>
	)
}

Header.propTypes = {
	siteTitle: PropTypes.string,
}

Header.defaultProps = {
	siteTitle: "",
}

export default Header
