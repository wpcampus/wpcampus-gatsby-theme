/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import SEO from "./seo"
import NavPrimary from "../components/navPrimary"
import Header from "./header"
import Heading from "./heading"
import Notifications from "./notifications"
import Sidebar from "./sidebar"
import Crumbs from "./crumbs"
import Conduct from "./conduct"
import Footer from "./footer"
import WPCGridDev from "./grid-dev"

const Layout = props => {

	const searchQuery = props.searchQuery
	const updateSearchQuery = props.updateSearchQuery
	const isHome = props.isHome
	const useTitleTemplate = props.useTitleTemplate
	const heading = props.heading
	const crumbs = props.crumbs
	const classes = props.classes
	const path = props.path
	const children = props.children

	let pageTitle = props.pageTitle
	if (!pageTitle && heading) {
		pageTitle = heading
	}

	const wpcampusAttr = {
		className: "wpcampus"
	}

	const showGrid = false && "development" === process.env.NODE_ENV && "1" === process.env.WPC_SHOW_GRID

	if (showGrid) {
		wpcampusAttr.className += " wpcampus--hasGridDev"
	}

	if (isHome) {
		wpcampusAttr.className += " wpcampus--home"
	}

	// Add path as a wrapper class.
	if (path){
		let pathSlug = path.replace(/^\//i, "")
		pathSlug = pathSlug.replace(/\/$/i, "")
		pathSlug = pathSlug.replace(/\//gi, "-")
		wpcampusAttr.className += " wpcampus--path-" + pathSlug
	}

	if (classes) {
		wpcampusAttr.className += ` ${classes}`
	}

	return (
		<div {...wpcampusAttr}>
			<a href="#main" className="wpc-skip-to-main">Skip to content</a>
			{showGrid ? <WPCGridDev /> : null}
			<SEO title={pageTitle} useTitleTemplate={useTitleTemplate} />
			<Header searchQuery={searchQuery} updateSearchQuery={updateSearchQuery} isHome={isHome} />
			{!isHome ? <div className="wpc-hero"></div> : null}
			<div className="wpc-body wpc-wrapper">
				<div className="wpc-container wpc-body__container">
					<div className="wpc-areas wpc-areas--grid wpc-areas--grid--rows wpc-body__areas">
						<div className="wpc-area wpc-body__area wpc-body__area--notifications">
							<Notifications />
						</div>
						<div className="wpc-area wpc-body__area wpc-body__area--nav">
							<NavPrimary />
						</div>
						<Crumbs crumbs={crumbs} classes="wpc-area wpc-body__area wpc-body__area--crumbs" />
						<div className="wpc-area wpc-body__area wpc-body__area--main">
							<main id="main" className="wpc-main wpc-wrapper">
								{!isHome && heading ? (<Heading level={1} heading={heading} />) : null}
								{children}
							</main>
						</div>
						<div className="wpc-area wpc-body__area wpc-body__area--sidebar">
							<Sidebar />
						</div>
					</div>
				</div>
			</div>
			<Conduct />
			<Footer />
		</div>
	)
}

Layout.propTypes = {
	searchQuery: PropTypes.string,
	updateSearchQuery: PropTypes.func,
	isHome: PropTypes.bool,
	pageTitle: PropTypes.string,
	useTitleTemplate: PropTypes.bool,
	heading: PropTypes.string,
	classes: PropTypes.string,
	crumbs: PropTypes.object,
	path: PropTypes.string,
	children: PropTypes.node.isRequired,
}

Layout.defaultProps = {
	isHome: false,
	useTitleTemplate: true
}

export default Layout
