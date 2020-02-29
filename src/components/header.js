import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/header.css"

const Header = ({ siteTitle }) => {
	return (
		<header className="header">
			<div className="header__container">
				<h1 className="header__siteTitle">
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
