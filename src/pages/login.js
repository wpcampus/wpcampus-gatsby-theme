import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"

import { login, isAuthenticated, setAuthRedirect } from "../utils/auth"
import LoadingLayout from "../components/loadingLayout"

const Login = ({ location }) => {

	const prevPath = location.state && location.state.prevPath || null

	if (prevPath) {
		setAuthRedirect(prevPath)
	}

	if (!isAuthenticated()) {

		// Initiate login process.
		login()

		const layoutAttr = {
			pageTitle: "Redirecting to login",
			message: "Redirecting to login"
		}

		return <LoadingLayout {...layoutAttr} />
	}

	navigate(prevPath || "/account/")

	return null
}

Login.propTypes = {
	location: PropTypes.object
}

export default Login