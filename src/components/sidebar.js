import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import QuotesIcon from "../svg/quotes"
import TwitterIcon from "../svg/twitter"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-wc-blog")
}

import "./../css/sidebar.css"

const Widget = ({ type, classes, children }) => {
	const widgetAttr = {
		className: `wpc-widget wpc-widget--${type}`
	}
	if (classes) {
		widgetAttr.className += ` ${classes}`
	}
	return <div {...widgetAttr}>
		{children}
	</div>
}

Widget.propTypes = {
	type: PropTypes.string.isRequired,
	classes: PropTypes.string,
	children: PropTypes.node.isRequired
}

const BlogWidget = () => {
	return <Widget type="blog">
		<h2 className="wpc-widget__heading"><Link className="wpc-icon-text" aria-label="The WPCampus Blog" to="/blog"><QuotesIcon />From our blog</Link></h2>
		<wpcampus-blog></wpcampus-blog>
	</Widget>
}

// @TODO replace with web component.
const TweetWidget = () => {
	return <Widget type="tweet">
		<h2 className="wpc-widget__heading"><a className="wpc-icon-text" href="https://twitter.com/wpcampusorg" aria-label="Follow WPCampus on Twitter"><TwitterIcon />@wpcampusorg</a></h2>
		<p className="wpc-widget__tweet"><a href="https://twitter.com/search?q=wpcampus">#WPCampus</a> has decided to pivot our 2020 in-person event to an online conference and have re-scheduled New Orleans for 2021. We have re-opened our call for speakers and hope you will consider sharing your experiences with us. #WordPress #HigherEd #heweb</p>
		<a className="wpc-widget__tweet-link" href="https://twitter.com/wpcampusorg/status/1248963787408973825" aria-label="Access tweet from April 10, 2020">April 10, 2020</a>
	</Widget>
}

const Sidebar = () => {
	return (
		<aside className="wpc-sidebar wpc-wrapper" aria-label="Sidebar">
			<BlogWidget />
			<TweetWidget />
		</aside>
	)
}

export default Sidebar
