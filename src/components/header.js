import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import WPCampusLogo from "../svg/logo"
import { User } from "../user/context"
import { SearchForm } from "../components/search"

import avatarEduwapuuBW from "../images/avatars/wpcampus-avatar-eduwapuu-bw.png"

import "./../css/header.css"

const HeaderArea = ({ children, area }) => {
	return <div className={`wpc-area wpc-header__area wpc-header__area--${area}`}>
		{children}
	</div>
}

HeaderArea.propTypes = {
	area: PropTypes.string.isRequired,
	children: PropTypes.node
}

const HeaderAreas = ({ children, hasGrid }) => {
	const gridCSS = hasGrid ? " wpc-areas--grid" : ""
	const attrs = {
		className: `wpc-areas${gridCSS} wpc-header__areas`
	}
	return <div {...attrs}>
		{children}
	</div>
}

HeaderAreas.propTypes = {
	hasGrid: PropTypes.bool,
	children: PropTypes.node.isRequired
}

HeaderAreas.defaultProps = {
	hasGrid: true
}

const HeaderMemberActions = ({ classes }) => {
	const actionsAttr = {
		className: "wpc-nav wpc-nav--actions",
		"aria-label": "Become a member or login"
	}
	if (classes) {
		actionsAttr.className += ` ${classes}`
	}
	return <nav {...actionsAttr}>
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/community/membership/">Become a member</Link></li>
			<li><Link className="wpc-button" to="/login/">Login</Link></li>
		</ul>
	</nav>
}

HeaderMemberActions.propTypes = {
	classes: PropTypes.string
}

const HeaderLoggedInActions = ({ user, classes }) => {
	const actionsAttr = {
		className: "wpc-nav wpc-nav--actions",
		"aria-label": "View profile or logout"
	}
	if (classes) {
		actionsAttr.className += ` ${classes}`
	}
	const LogoutButton = user.LogoutButton
	return <nav {...actionsAttr}>
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/profile/">Your profile</Link></li>
			<li><LogoutButton isPlain={true} /></li>
		</ul>
	</nav>
}

HeaderLoggedInActions.propTypes = {
	user: PropTypes.object,
	classes: PropTypes.string
}

const UserLoggedInActions = ({ user }) => {

	const userName = user.getDisplayName()

	let userNameDisplay
	if (userName) {
		userNameDisplay = "Hi, " + userName
	} else {
		userNameDisplay = "Hi!"
	}

	return <div className="wpc-user">
		<img className="wpc-user__avatar" src={avatarEduwapuuBW} alt="" />
		<div className="wpc-user__info">
			<span className="wpc-user__name">{userNameDisplay}</span>
			<HeaderLoggedInActions user={user} classes="wpc-user__actions" />
		</div>
	</div>
}

UserLoggedInActions.propTypes = {
	user: PropTypes.object
}

// Going to make a few different banners.
const HeaderHomeBanner1 = () => {

	const handleUserDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			return <UserLoggedInActions user={user} />
		}
		return <HeaderMemberActions classes="wpc-home-banner__actions wpc-member__actions" />
	}

	const searchFormAttr = {
		showSubmitIcon: true
	}

	return <div className="wpc-home-banner">
		<ul className="wpc-home-banner__numbers">
			<li className="wpc-numbers wpc-numbers--members">
				<span className="wpc-numbers__count">1,088</span>
				<span className="wpc-numbers__label">Members</span>
			</li>
			<li className="wpc-numbers wpc-numbers--institutions">
				<span className="wpc-numbers__count">524</span>
				<span className="wpc-numbers__label">Institutions</span>
			</li>
			<li className="wpc-numbers wpc-numbers--wpcampus">
				<span className="wpc-numbers__count">1</span>
				<span className="wpc-numbers__label"><WPCampusLogo includeTagline={false} /></span>
			</li>
		</ul>
		<p className="wpc-home-banner__tagline">Where WordPress meets Higher Education</p>
		<SearchForm {...searchFormAttr} />
		<User.Consumer>{handleUserDisplay}</User.Consumer>
	</div>
}

const Header = ({ isHome }) => {

	const handleUserDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			return <UserLoggedInActions user={user} />
		}
		return <HeaderMemberActions classes="wpc-member__actions" />
	}

	const headerAttr = {
		className: "wpc-header wpc-wrapper"
	}

	const searchFormAttr = {
		showSubmitIcon: true
	}

	let headerAreas
	if (isHome) {

		// Select the home banner.
		const banner = <HeaderHomeBanner1 />
		headerAttr.className += " wpc-header--home-one"

		headerAreas = <HeaderAreas hasGrid={false}>
			<HeaderArea area="banner">
				{banner}
			</HeaderArea>
			<HeaderArea area="search">
				<SearchForm {...searchFormAttr} />
			</HeaderArea>
		</HeaderAreas>
	} else {

		headerAreas = <HeaderAreas>
			<HeaderArea area="logo">
				<span className="wpc-header__heading wpc-header__heading--site">
					<Link to="/" aria-label="Home"><WPCampusLogo /></Link>
				</span>
			</HeaderArea>
			<HeaderArea area="actions">
				<User.Consumer>{handleUserDisplay}</User.Consumer>
			</HeaderArea>
			<HeaderArea area="search">
				<SearchForm {...searchFormAttr} />
			</HeaderArea>
		</HeaderAreas>
	}

	return (
		<header {...headerAttr}>
			<div className="wpc-container wpc-header__container">
				{headerAreas}
			</div>
		</header>
	)
}

Header.propTypes = {
	isHome: PropTypes.bool
}

Header.defaultProps = {
	isHome: false,
}

export default Header
