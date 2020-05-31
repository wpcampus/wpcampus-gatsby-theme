import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { navigate } from "gatsby"

import { getAuthRedirect, handleLogout, handleLogin } from "@wpcampus/wpcampus-auth"
import LoadingLayout from "../components/loadingLayout"
import { isBrowser } from "../utils/utilities"

const mapStateToProps = ({ user }) => {
	return { user }
}

const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (data) => dispatch({
			type: "setUser",
			payload: {
				user: data
			}
		})
	}
}

/*
 * Callback doesn't run silentAuth.
 * 
 * If a user visits this page directly, it will log them out.
 * @TODO change?
 */
const Callback = ({ user, setUser }) => {

	// This means the callback has a code.
	const loggingIn = isBrowser && window.location.search.search(/\?code=[a-z0-9]+/) >= 0
	if (loggingIn) {

		handleLogin({ user, setUser }).then(() => {
			navigate(getAuthRedirect(true) || "/")
		})

		return <LoadingLayout message="Logging you in" />
	}

	handleLogout().then(() => {
		// Delay the authentication a little so loading page doesn't flash
		setTimeout(function () {
			navigate(getAuthRedirect(true) || "/")
		}, 1000)
	})

	return <LoadingLayout message="Logging you out" />
}

Callback.propTypes = {
	user: PropTypes.object.isRequired,
	setUser: PropTypes.func.isRequired,
}

// Connect this component to our provider.
const ConnectedCallback = connect(mapStateToProps, mapDispatchToProps)(Callback)

export default ConnectedCallback