import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { navigate } from "gatsby"

import { login, setAuthRedirect } from "../utils/auth"
import { isBrowser } from "../utils/utilities"
import LoadingLayout from "../components/loadingLayout"

const mapStateToProps = ({ user, isLoading }) => {
	return { user, isLoading }
}

const Login = ({ location, user, isLoading }) => {

	const path = "/login/"

	if (!isBrowser) {
		return <LoadingLayout path={path} />
	}

	// Wait for silentAuth to finish.
	if (isLoading) {
		return <LoadingLayout path={path} />
	}

	// Will define our redirect for after login.
	const prevPath = location.state && location.state.prevPath || null
	if (prevPath) {
		setAuthRedirect(prevPath)
	}

	/*
	 * Initiate login process.
	 * silentAuth checked for authentication.
	 */
	if (!user.isLoggedIn()) {

		login()

		const layoutAttr = {
			pageTitle: "Redirecting to login",
			message: "Redirecting to login",
			path: path,
		}

		return <LoadingLayout {...layoutAttr} />
	}

	// If logged in, redirect.
	navigate(prevPath || "/account/")

	return <LoadingLayout path={path} />
}

Login.propTypes = {
	location: PropTypes.object,
	user: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
}

// Connect this component to our provider.
const ConnectedLogin = connect(mapStateToProps)(Login)

export default ConnectedLogin