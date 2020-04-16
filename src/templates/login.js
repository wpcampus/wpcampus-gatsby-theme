import React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import { User } from "../user/context"
import LoginForm from "../user/loginForm"

// @TODO tell robots dont index this page

const Login = () => {
	const handleDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			navigate( "/profile/" )
		}
		return <LoginForm />
	}
	return (
		<Layout heading="Login">
			<User.Consumer>{handleDisplay}</User.Consumer>
		</Layout>
	)
}

export default Login