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

	const {
		isHome,
		includeSidebar,
		sidebarBottom,
		useTitleTemplate,
		heading,
		crumbs,
		classes,
		path,
		children
	} = props

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

	if (includeSidebar) {
		wpcampusAttr.className += " wpcampus--sidebar"

		if (sidebarBottom) {
			wpcampusAttr.className += " wpcampus--sidebar--bottom"
		}
	}

	if (isHome) {
		wpcampusAttr.className += " wpcampus--home"
	}

	// Add path as a wrapper class.
	if (path) {
		let pathSlug = path.replace(/^\//i, "")
		pathSlug = pathSlug.replace(/\/$/i, "")
		pathSlug = pathSlug.replace(/\//gi, "-")
		wpcampusAttr.className += " wpcampus--path-" + pathSlug
	}

	if (classes) {
		wpcampusAttr.className += ` ${classes}`
	}

	let crumbsComp
	if (crumbs) {
		crumbsComp = <Crumbs crumbs={crumbs} classes="wpc-area wpc-body__area wpc-body__area--crumbs" />
	}

	let sidebarArea
	if (includeSidebar) {
		sidebarArea = <div className="wpc-area wpc-body__area wpc-body__area--sidebar">
			<Sidebar />
		</div>
	}

	const bodyAreasAttr = {
		className: "wpc-areas wpc-areas--grid wpc-areas--grid--rows wpc-body__areas"
	}

	if (includeSidebar) {
		bodyAreasAttr.className += " wpc-body__areas--sidebar"

		if (sidebarBottom) {
			bodyAreasAttr.className += " wpc-body__areas--sidebar--bottom"
		}
	}

	const mainHeadingAttr = {
		level: 1,
		heading: heading
	}

	if (isHome) {
		mainHeadingAttr.classes = "for-screen-reader"
	}

	const mainHeading = <Heading {...mainHeadingAttr} />

	return (
		<div {...wpcampusAttr}>
			<a href="#main" className="wpc-skip-to-main">Skip to content</a>
			{showGrid ? <WPCGridDev /> : null}
			<SEO title={pageTitle} useTitleTemplate={useTitleTemplate} />
			<Header isHome={isHome} />
			{!isHome ? <div className="wpc-hero"></div> : null}
			<div className="wpc-body wpc-wrapper">
				<div className="wpc-container wpc-body__container">
					<div {...bodyAreasAttr}>
						<div className="wpc-area wpc-body__area wpc-body__area--nav">
							<NavPrimary />
						</div>
						<div className="wpc-area wpc-body__area wpc-body__area--notifications">
							<Notifications />
						</div>
						{crumbsComp}
						<div className="wpc-area wpc-body__area wpc-body__area--main">
							<main id="main" className="wpc-main wpc-wrapper">
								{mainHeading}
								{children}
							</main>
						</div>
						{sidebarArea}
					</div>
				</div>
			</div>
			<Conduct />
			<Footer />
		</div>
	)
}

Layout.propTypes = {
	isHome: PropTypes.bool,
	includeSidebar: PropTypes.bool,
	sidebarBottom: PropTypes.bool,
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
	includeSidebar: true,
	sidebarBottom: false,
	useTitleTemplate: true
}

export default Layout
