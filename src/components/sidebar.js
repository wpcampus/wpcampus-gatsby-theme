import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

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
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-blog")
	}, [])
	return useMemo(() => {
		return <Widget type="blog">
			<h2 className="wpc-widget__heading">
				<span className="wpc-icon wpc-icon--quotes"></span>
				<Link aria-label="The WPCampus Blog" to="/blog">From our Blog</Link></h2>
			<wpcampus-blog></wpcampus-blog>
			<a className="wpc-button wpc-button--primary" href="http://eepurl.com/dOd-Q9" target="_blank" rel="noreferrer">Subscribe to Community Blog updates</a>
		</Widget>
	})
}

const TweetsWidget = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-tweets")
	}, [])
	return useMemo(() => {
		return <Widget type="tweets">
			<h2 className="wpc-widget__heading">
				<span className="wpc-icon wpc-icon--twitter"></span>
				<a href="https://twitter.com/wpcampusorg" aria-label="Follow WPCampus on Twitter">@wpcampusorg</a>
			</h2>
			<wpcampus-tweets></wpcampus-tweets>
			<a className="wpc-button wpc-button--primary" href="https://twitter.com/wpcampusorg">Follow @wpcampusorg on Twitter</a>
		</Widget>
	})
}

const Sidebar = () => {
	return (
		<aside className="wpc-sidebar wpc-wrapper" aria-label="Sidebar">
			<BlogWidget />
			<TweetsWidget />
		</aside>
	)
}

export default Sidebar
