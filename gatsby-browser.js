/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { silentAuth } from "./src/utils/auth"

import "./src/css/fonts.css"
import "./src/css/base.css"
import "./src/css/grid.css"
import "./src/css/body.css"
import "./src/css/loading.css"
import "./src/css/forms.css"

import "./src/css/header.css"
import "./src/css/nav.css"
import "./src/css/notifications.css"
import "./src/css/sidebar.css"
import "./src/css/conduct.css"
import "./src/css/footer.css"

const SessionCheck = ({ children }) => {
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		silentAuth(function() {
			setLoading(false)
		})
	}, [])
	return loading ? null : <React.Fragment>{children}</React.Fragment>
}

SessionCheck.propTypes = {
	children: PropTypes.node
}

export const wrapRootElement = ({ element }) => (
	<SessionCheck>{element}</SessionCheck>
)

wrapRootElement.propTypes = {
	element: PropTypes.object.isRequired
}