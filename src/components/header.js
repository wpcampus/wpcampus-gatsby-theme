import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/header.css"

const Header = ({ siteTitle }) => {
	// Have to use separate function to process <User.Consumer> and pass args
	const handleUserDisplay = user => {
		const args = {
			showLogin: true,
		}
		return userDisplay(user, args)
	}
	return (
		<header className="wpc-header wpc-wrapper">
			<div className="wpc-container wpc-header__container">
				<div className="wpc-areas wpc-areas--grid wpc-header__areas">
					<div className="wpc-area wpc-header__area wpc-header__area--logo">
						<h1 className="wpc-header__heading wpc-header__heading--site">
							<Link to="/">{siteTitle}</Link>
						</h1>
					</div>
					<div className="wpc-area wpc-header__area wpc-header__area--meta">
						<User.Consumer>{handleUserDisplay}</User.Consumer>
					</div>
				</div>
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
