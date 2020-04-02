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
import Crumbs from "./crumbs"
import Conduct from "./conduct"
import Footer from "./footer"
import WPCGridDev from "./grid-dev"

const Layout = ({ pageTitle, useTitleTemplate, heading, crumbs, children }) => {

	if (!pageTitle && heading) {
		pageTitle = heading
	}

	const wpcampusAttr = {
		className: "wpcampus"
	}

	const showGrid = "development" === process.env.NODE_ENV && "1" === process.env.WPC_SHOW_GRID

	if (showGrid) {
		wpcampusAttr.className += " wpcampus--hasGridDev"
	}

	return (
		<div {...wpcampusAttr}>
			{showGrid ? <WPCGridDev /> : null}
			<SEO title={pageTitle} useTitleTemplate={useTitleTemplate} />
			<Header />
			<Notifications />
			<div className="wpc-body wpc-wrapper">
				<div className="wpc-container wpc-body__container">
					<div className="wpc-areas wpc-areas--grid wpc-areas--grid--rows wpc-body__areas">
						<div className="wpc-area wpc-body__area wpc-body__area--nav">
							<NavPrimary />
						</div>
						<Crumbs crumbs={crumbs} classes="wpc-area wpc-body__area wpc-body__area--crumbs" />
						<div className="wpc-area wpc-body__area wpc-body__area--main">
							<main id="main" className="wpc-main wpc-wrapper">
								{heading ? (<Heading level={1} heading={heading} />) : null}
								{children}
							</main>
						</div>
						<div className="wpc-area wpc-body__area wpc-body__area--sidebar">
							<aside className="wpc-sidebar wpc-wrapper" aria-label="Sidebar"></aside>
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
	pageTitle: PropTypes.string,
	useTitleTemplate: PropTypes.bool,
	heading: PropTypes.string,
	crumbs: PropTypes.object,
	children: PropTypes.node.isRequired,
}

Layout.defaultProps = {
	useTitleTemplate: true
}

export default Layout
