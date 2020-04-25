import React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import { User } from "../user/context"
import { LoginLayout } from "../user/login"

const Login = () => {
	const handleDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			navigate( "/profile/" )
		}
		return <LoginLayout />
	}

	// Don't index or follow.
	const metaRobots = ["nofollow","noindex"]

	return (
		<Layout heading="Login" metaRobots={metaRobots}>
			<User.Consumer>{handleDisplay}</User.Consumer>
		</Layout>
	)
}

export default Login