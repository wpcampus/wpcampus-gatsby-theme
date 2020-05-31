import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { isBrowser } from "../utils/utilities"

import { getAccessCookie, setAuthRedirect, handleLogout, logout } from "../utils/auth"
import LoadingLayout from "../components/loadingLayout"

const Logout = ({ location }) => {
	if (!isBrowser) {
		return <LoadingLayout />
	}

	// Will define our redirect for after login.
	let prevPath = location.state && location.state.prevPath || null
	if (prevPath) {

		// Never logout redirect to account page.
		if ("/account/" === prevPath) {
			prevPath = "/"
		}

		setAuthRedirect(prevPath)
	}

	let access = getAccessCookie()

	// If no existing access token, delete the session.
	if (!access) {
		handleLogout().then(() => {
			navigate(prevPath || "/")
		})
	} else {

		// Redirects to SSO logout.
		logout(access)
	}

	return <LoadingLayout message="Logging you out" />
}

Logout.propTypes = {
	location: PropTypes.object
}

export default Logout