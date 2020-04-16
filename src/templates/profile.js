import React from "react"

import Layout from "../components/layout"
import { User } from "../user/context"
import LoginForm from "../user/loginForm"

// @TODO tell robots dont index this page

const Profile = () => {
	const handleDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			return "logged in"
		}
		const args = {
			showLogin: true,
		}
		return <LoginForm />
	}
	return (
		<Layout heading="Profile">
			<User.Consumer>{handleDisplay}</User.Consumer>
		</Layout>
	)
}

export default Profile