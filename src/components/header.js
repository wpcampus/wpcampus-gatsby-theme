import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import WPCampusLogo from "../svg/logo"
import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/header.css"

const Header = props => {
	// Have to use separate function to process <User.Consumer> and pass args
	const handleUserDisplay = user => {
		const args = {
			showLogin: true,
		}
		return userDisplay(user, args)
	}

	let HeadingTag

	if (props.isHome) {
		HeadingTag = "h1"
	} else {
		HeadingTag = "span"
	}

	return (
		<header className="wpc-header wpc-wrapper">
			<div className="wpc-container wpc-header__container">
				<div className="wpc-areas wpc-areas--grid wpc-header__areas">
					<div className="wpc-area wpc-header__area wpc-header__area--actions">
						<nav className="wpc-nav wpc-nav--actions" aria-label="Login or become a member">
							<ul>
								<li><a className="wpc-button wpc-button--primary" href="/">Login</a></li>
								<li><a className="wpc-button" href="/">Become a member</a></li>
							</ul>
						</nav>
					</div>
					<div className="wpc-area wpc-header__area wpc-header__area--logo">
						<HeadingTag className="wpc-header__heading wpc-header__heading--site">
							<Link to="/" aria-label="Home"><WPCampusLogo /></Link>
						</HeadingTag>
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
	isHome: PropTypes.bool,
}

Header.defaultProps = {
	isHome: false,
}

export default Header
