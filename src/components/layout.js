/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import SEO from "./seo"
import NavPrimary from "../components/navPrimary"
import Header from "./header"
import Footer from "./footer"
import WPCGridDev from "./grid-dev"
import WebComponent from "./webComponents"

import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/notifications.css"

const Layout = ({ pageTitle, heading, children }) => {
	const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

	// Have to use separate function to process <User.Consumer> and pass args
	const handleUserDisplay = user => {
		const args = {
			showLogin: true,
		}
		return userDisplay(user, args)
	}

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
			<SEO title={pageTitle} />
			<Header siteTitle={data.site.siteMetadata.title} />
			<NavPrimary />
			<main id="main" className="wpc-main wpc-wrapper">
				<div className="wpc-container">
					<User.Consumer>{handleUserDisplay}</User.Consumer>
					{heading ? (<h1>{heading}</h1>) : null}
					{children}
			<WebComponent classes="wpc-notifications" tag="wpcampus-notifications" />
				</div>
			</main>
			<Footer />
		</div>
	)
}

Layout.propTypes = {
	pageTitle: PropTypes.string,
	heading: PropTypes.string,
	children: PropTypes.node.isRequired,
}

export default Layout
