import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"

import { login, isAuthenticated, setAuthRedirect } from "../utils/auth"

// @TODO delete? we need to create an "add account" page.
// @TODO add "add account" button to WP login screen.
const Login = ({ location }) => {

	const prevPath = location.state && location.state.prevPath || null

	if (prevPath) {
		setAuthRedirect(prevPath)
	}

	if (!isAuthenticated()) {
		login()
		// @TODO make this look prettier.
		return <p>Redirecting to login.</p>
	}

	navigate(prevPath || "/account/")

	return null

	// Don't index or follow.
	/*const metaRobots = ["nofollow", "noindex"]

	return (
		<Layout heading="Login" metaRobots={metaRobots}></Layout>
	)*/
}

Login.propTypes = {
	location: PropTypes.object
}

export default Login