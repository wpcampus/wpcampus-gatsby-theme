import React from "react"
import { navigate } from "gatsby"

import { login, isAuthenticated } from "../utils/auth"

// @TODO delete? we need to create an "add account" page.
// @TODO add "add account" button to WP login screen.
const Login = () => {
	if (!isAuthenticated()) {
		login()
		// @TODO make this look prettier.
		return <p>Redirecting to login.</p>
	}

	navigate("/account/")

	// Don't index or follow.
	/*const metaRobots = ["nofollow", "noindex"]

	return (
		<Layout heading="Login" metaRobots={metaRobots}>
			<LoginLayout />
		</Layout>
	)*/
}

export default Login