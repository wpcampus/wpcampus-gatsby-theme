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

const Layout = props => {

	const isHome = props.isHome
	const useTitleTemplate = props.useTitleTemplate
	const heading = props.heading
	const crumbs = props.crumbs
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

	return (
		<div {...wpcampusAttr}>
			{showGrid ? <WPCGridDev /> : null}
			<SEO title={pageTitle} useTitleTemplate={useTitleTemplate} />
			<Header isHome={isHome} />
			<div className="wpc-hero"></div>
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
								{heading ? (<Heading level={1} heading={heading} />) : null}
								{children}
							</main>
						</div>
						<div className="wpc-area wpc-body__area wpc-body__area--sidebar">
							<aside className="wpc-sidebar wpc-wrapper" aria-label="Sidebar">
								<div className="wpc-blog-posts">
									<h2><a href="https://wpcampus.org/blog">From our blog</a></h2>
									<h3><a href="https://wpcampus.org/2020/03/wpcampus-2020-to-go-online/">WPCampus 2020 to go online, meet in New Orleans for 2021</a></h3><p>The WPCampus community decided to pivot our 2020 in-person event to an online conference and re-scheduled to convene in New Orleans, Louisiana, for WPCampus 2021. WPCampus 2020 Online will take place July 15-17, 2020. The three-day online conference will include a variety of formats, including general lectures, lightning talks, longer-form sessions like workshops, and more. […]</p>
								</div>
							</aside>
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
	isHome: PropTypes.bool,
	pageTitle: PropTypes.string,
	useTitleTemplate: PropTypes.bool,
	heading: PropTypes.string,
	crumbs: PropTypes.object,
	children: PropTypes.node.isRequired,
}

Layout.defaultProps = {
	isHome: false,
	useTitleTemplate: true
}

export default Layout
