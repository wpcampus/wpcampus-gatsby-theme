import React from "react"
//import { navigate } from "gatsby"
//import PropTypes from "prop-types"

import Layout from "../components/layout"
import { User } from "../user/context"
import userDisplay from "../user/display"

// @TODO tell robots dont index this page

const Profile = props => {
	const handleDisplay = user => {
		if (!user.isActive()) {
			return ""
		}
		if (user.isLoggedIn()) {
			return "logged in"
		}
		//navigate("/login")
		const args = {
			showLogin: true,
		}
		return userDisplay(user, args)
	}
	return (
		<Layout heading="Profile">
			<User.Consumer>{handleDisplay}</User.Consumer>
		</Layout>
	)
}

/*Profile.propTypes = {
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}*/

export default Profile