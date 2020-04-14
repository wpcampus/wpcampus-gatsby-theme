import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import WPCampusLogo from "../svg/logo"
//import { User } from "../user/context"
//import userDisplay from "../user/display"
import { SearchForm } from "../components/search"

import "./../css/header.css"

// Have to use separate function to process <User.Consumer> and pass args
/*const handleUserDisplay = user => {
	const args = {
		showLogin: true,
	}
	return userDisplay(user, args)
}*/

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

const HeaderMemberActions = () => {
	return <nav className="wpc-nav wpc-nav--actions" aria-label="Become a member or login">
		<ul>
			<li><Link className="wpc-button wpc-button--primary" to="/community/membership">Become a member</Link></li>
			<li><Link className="wpc-button" to="/login">Login</Link></li>
		</ul>
	</nav>
}

// Going to make a few different banners.
const HeaderHomeBanner1 = () => {

	const searchFormAttr = {
		showSubmit: false
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
		<HeaderMemberActions />
	</div>
}

const Header = ({ isHome, searchQuery, updateSearchQuery }) => {

	const headerAttr = {
		className: "wpc-header wpc-wrapper"
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

		const searchFormAttr = {
			showSubmit: false,
			searchQuery: searchQuery,
			updateSearchQuery: updateSearchQuery
		}

		headerAreas = <HeaderAreas>
			<HeaderArea area="actions">
				<nav className="wpc-nav wpc-nav--actions" aria-label="Become a member or login">
					<ul>
						<li><a className="wpc-button wpc-button--primary" href="/">Become a member</a></li>
						<li><a className="wpc-button" href="/">Login</a></li>
					</ul>
				</nav>
			</HeaderArea>
			<HeaderArea area="logo">
				<span className="wpc-header__heading wpc-header__heading--site">
					<Link to="/" aria-label="Home"><WPCampusLogo /></Link>
				</span>
			</HeaderArea>
			<HeaderArea area="meta">
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
	searchQuery: PropTypes.string,
	updateSearchQuery: PropTypes.func,
	isHome: PropTypes.bool
}

Header.defaultProps = {
	isHome: false,
}

export default Header
