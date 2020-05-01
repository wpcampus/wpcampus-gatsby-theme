import auth0 from "auth0-js"
import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"

const isBrowser = typeof window !== "undefined"

const auth = isBrowser
	? new auth0.WebAuth({
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENTID,
		redirectUri: process.env.AUTH0_CALLBACK,
		responseType: "token id_token",
		scope: "openid profile email",
	})
	: {}

const tokens = {
	accessToken: false,
	idToken: false,
	expiresAt: false,
}

let user = {}

export const isAuthenticated = () => {
	if (!isBrowser) {
		return
	}
	return localStorage.getItem("isLoggedIn") === "true"
}

export const login = () => {
	if (!isBrowser) {
		return
	}
	auth.authorize()
}

const setSession = (cb = () => { }) => (err, authResult) => {
	if (err) {
		navigate("/")
		cb()
		return
	}

	if (authResult && authResult.accessToken && authResult.idToken) {
		let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
		tokens.accessToken = authResult.accessToken
		tokens.idToken = authResult.idToken
		tokens.expiresAt = expiresAt
		user = authResult.idTokenPayload
		localStorage.setItem("isLoggedIn", true)

		// @TODO be able to set custom redirect.
		navigate("/account")

		cb()
	}
}

export const handleAuthentication = () => {
	if (!isBrowser) {
		return
	}
	auth.parseHash(setSession())
}

export const getProfile = () => {
	return user
}

// @TODO update.
export const getDisplayName = () => {
	const user = getProfile()
	return user.name
	/*if (state.user && state.user.display_name) {
		return state.user.display_name
	}*/
}

/*const getUserInfo = () => {
	if (!state.user) {
		return false
	}
	if (!state.user.ID) {
		return false
	}
	if (!state.user.display_name) {
		return false
	}
	return state.user
}

const getUsername = () => {
	if (state.user && state.user.username) {
		return state.user.username
	}
	return ""
}

const getFirstName = () => {
	if (state.user && state.user.first_name) {
		return state.user.first_name
	}
	return ""
}

const getLastName = () => {
	if (state.user && state.user.last_name) {
		return state.user.last_name
	}
	return ""
}

const getEmail = () => {
	if (state.user && state.user.email) {
		return state.user.email
	}
	return ""
}

const getWebsite = () => {
	if (state.user && state.user.website) {
		return state.user.website
	}
	return ""
}

const getTwitter = () => {
	if (state.user && state.user.twitter) {
		return state.user.twitter
	}
	return ""
}

const getBio = () => {
	if (state.user && state.user.bio) {
		return state.user.bio
	}
	return ""
}

const getCompany = () => {
	if (state.user && state.user.company) {
		return state.user.company
	}
	return ""
}

const getCompanyPosition = () => {
	if (state.user && state.user.company_position) {
		return state.user.company_position
	}
	return ""
}*/

export const silentAuth = callback => {
	if (!isAuthenticated()) return callback()
	auth.checkSession({}, setSession(callback))
}

export const logout = () => {
	localStorage.setItem("isLoggedIn", false)
	auth.logout()
}

export const LogoutButton = ({ isPlain }) => {
	const buttonAttr = {
		className: "wpc-button wpc-button--logout",
		onClick: logout
	}
	if (isPlain) {
		buttonAttr.className += " wpc-button--plain"
	}
	return <button {...buttonAttr}>Logout</button>
}

LogoutButton.propTypes = {
	isPlain: PropTypes.bool
}

LogoutButton.defaultProps = {
	isPlain: false
}