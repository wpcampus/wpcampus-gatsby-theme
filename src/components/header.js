import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"

import WPCampusLogo from "../svg/logo"
import { SearchForm } from "../components/search"
import { LogoutLink } from "../utils/auth"
import { isBrowser } from "../utils/utilities"

import avatarEduwapuuBW from "../images/avatars/wpcampus-avatar-eduwapuu-bw.png"

const mapStateToProps = ({ user, isLoading }) => {
	return { user, isLoading }
}

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

	const prevPath = isBrowser ? window.location.pathname : "/"

	return <nav {...actionsAttr}>
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/community/membership/">Become a member</Link></li>
			<li><Link className="wpc-button" to="/login/" state={{ prevPath: prevPath }} rel="preload">Login</Link></li>
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

	const prevPath = isBrowser ? window.location.pathname : "/"

	return <nav {...actionsAttr}>
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/account/" state={{ prevPath: prevPath }} rel="preload">Your account</Link></li>
			<li><LogoutLink isPlain={true} redirectPath={prevPath} /></li>
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
			<HeaderLoggedInActions classes="wpc-user__actions" />
		</div>
	</div>
}

UserLoggedInActions.propTypes = {
	user: PropTypes.object
}

const HeaderUser = ({ user, isLoading }) => {
	if (isLoading) {
		return null
	}
	if (!user.isLoggedIn()) {
		return <HeaderMemberActions classes="wpc-member__actions" />
	}
	return <UserLoggedInActions user={user} />
}

HeaderUser.propTypes = {
	user: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
}

// Connect this component to our provider.
const ConnectedHeaderUser = connect(mapStateToProps)(HeaderUser)

// Going to make a few different banners.
const HeaderHomeBanner1 = () => {

	const searchFormAttr = {
		showSubmitIcon: true
	}

	const memberCount = "1,763"
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
		<p className="wpc-home-banner__tagline">Where WordPress meets higher education</p>
		<SearchForm {...searchFormAttr} />
		<ConnectedHeaderUser />
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
				<ConnectedHeaderUser />
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
