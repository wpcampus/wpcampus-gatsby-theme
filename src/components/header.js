import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import WPCampusLogo from "../svg/logo"
import { SearchForm } from "../components/search"
import { isAuthenticated, getUser, LogoutButton } from "../utils/auth"

import avatarEduwapuuBW from "../images/avatars/wpcampus-avatar-eduwapuu-bw.png"

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
			<li><Link className="wpc-button" to="/login/" state={{ prevPath: location.pathname }} rel="preload">Login</Link></li>
		</ul>
	</nav>
}

HeaderMemberActions.propTypes = {
	classes: PropTypes.string
}

const HeaderLoggedInActions = ({ classes }) => {
	const actionsAttr = {
		className: "wpc-nav wpc-nav--actions",
		"aria-label": "Access account or logout"
	}
	if (classes) {
		actionsAttr.className += ` ${classes}`
	}
	return <nav {...actionsAttr}>
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/account/" rel="preload">Your account</Link></li>
			<li><LogoutButton isPlain={true} redirectPath={location.pathname} /></li>
		</ul>
	</nav>
}

HeaderLoggedInActions.propTypes = {
	user: PropTypes.object,
	classes: PropTypes.string
}

const UserLoggedInActions = () => {

	const user = getUser()
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
			<HeaderLoggedInActions classes="wpc-user__actions" />
		</div>
	</div>
}

UserLoggedInActions.propTypes = {
	user: PropTypes.object
}

// @TODO do we need to pass user as an object so updates when necessary?
const HeaderUser = () => {
	if (!isAuthenticated()) {
		return <HeaderMemberActions classes="wpc-member__actions" />
	}
	return <UserLoggedInActions />
}

const HeaderHomeUser = () => {
	if (!isAuthenticated()) {
		return <HeaderMemberActions classes="wpc-home-banner__actions wpc-member__actions" />
	}
	return <UserLoggedInActions />
}

// Going to make a few different banners.
const HeaderHomeBanner1 = () => {

	const searchFormAttr = {
		showSubmitIcon: true
	}

	const memberCount = "1,090"
	const institutionCount = "688"

	return <div className="wpc-home-banner">
		<ul className="wpc-home-banner__numbers">
			<li className="wpc-numbers wpc-numbers--members">
				<span className="wpc-numbers__count">{memberCount}</span>
				<span className="wpc-numbers__label">Members</span>
			</li>
			<li className="wpc-numbers wpc-numbers--institutions">
				<span className="wpc-numbers__count">{institutionCount}</span>
				<span className="wpc-numbers__label">Institutions</span>
			</li>
			<li className="wpc-numbers wpc-numbers--wpcampus">
				<span className="wpc-numbers__count">1</span>
				<span className="wpc-numbers__label"><WPCampusLogo includeTagline={false} /></span>
			</li>
		</ul>
		<p className="wpc-home-banner__tagline">Where WordPress meets Higher Education</p>
		<SearchForm {...searchFormAttr} />
		<HeaderUser />
	</div>
}

const Header = ({ isHome }) => {

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
			<HeaderArea area="meta"></HeaderArea>
		</HeaderAreas>
	} else {

		headerAreas = <HeaderAreas>
			<HeaderArea area="logo">
				<span className="wpc-header__heading wpc-header__heading--site">
					<Link to="/" aria-label="Home"><WPCampusLogo /></Link>
				</span>
			</HeaderArea>
			<HeaderArea area="actions">
				<HeaderHomeUser />
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
