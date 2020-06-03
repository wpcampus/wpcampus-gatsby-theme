import React from "react"
import PropTypes from "prop-types"

import SEO from "./seo"

import TruckSheep from "../svg/trucksheep"

const LoadingLayout = props => {

	const {
		metaDescription,
		hideMessage,
	} = props

	const wpcampusAttr = {
		className: "wpcampus wpcampus--loading"
	}

	// Don't index or follow.
	const metaRobots = ["nofollow", "noindex"]

	let message = props.message

	let pageTitle = props.pageTitle || message

	if (!pageTitle) {
		pageTitle = "Loading"
	}

	const seoAttr = {
		path: props.path,
		title: pageTitle,
		description: metaDescription,
		metaRobots: metaRobots,
		htmlClass: "wpc-html--loading",
	}

	if (message) {

		const messageAttr = {}

		if (hideMessage) {
			messageAttr.className = " for-screen-reader"
		}

		message = <h1 {...messageAttr}>{message}</h1>
	}

	return (
		<div {...wpcampusAttr}>
			<SEO {...seoAttr} />
			<main>
				<div className="wpc-loading">
					<TruckSheep />
					{message}
				</div>
			</main>
		</div>
	)
}

LoadingLayout.propTypes = {
	metaDescription: PropTypes.string,
	path: PropTypes.string.isRequired,
	pageTitle: PropTypes.string,
	message: PropTypes.string,
	hideMessage: PropTypes.bool
}

LoadingLayout.defaultProps = {
	pageTitle: "Loading",
	message: "Loading some sheep",
	hideMessage: false
}

export default LoadingLayout