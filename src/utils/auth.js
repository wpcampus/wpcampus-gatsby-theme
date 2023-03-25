import Cookies from "js-cookie"
import ClientOAuth2 from "client-oauth2"
import crypto from "crypto"
import React from "react"
import PropTypes from "prop-types"

import { Link, navigate } from "gatsby"
import { isBrowser } from "../utils/utilities"

const authAccessCookieKey = "wpAuthAccess"
const algorithm = "aes-256-cbc"
const key = process.env.GATSBY_WPAUTH_CRYPTO_KEY
const iv = process.env.GATSBY_WPAUTH_CRYPTO_IV

const hasLocalStorage = typeof localStorage !== "undefined"

// Encrypt a string of text.
function encrypt(text) {
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
	let encrypted = cipher.update(text)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return encrypted.toString("hex")
}

// Decrypt a string of text.
function decrypt(text) {
	let encryptedText = Buffer.from(text, "hex")
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
	let decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString()
}

// Generate a random string.
function randomString(length) {
	if (!isBrowser) {
		return null
	}
	var bytes = new Uint8Array(length)
	var result = []
	var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~"
	var cryptoObj = window.crypto || window.msCrypto
	if (!cryptoObj) {
		return null
	}
	var random = cryptoObj.getRandomValues(bytes)
	for (var a = 0; a < random.length; a++) {
		result.push(charset[random[a] % charset.length])
	}
	return result.join("")
}

// Setup our auth client.
const auth = isBrowser
	? new ClientOAuth2({
		clientId: process.env.GATSBY_WPAUTH_CLIENTID,
		clientSecret: process.env.GATSBY_WPAUTH_CLIENTSECRET,
		accessTokenUri: process.env.GATSBY_WPAUTH_TOKEN,
		authorizationUri: process.env.GATSBY_WPAUTH_AUTHORIZE,
		redirectUri: process.env.GATSBY_WPAUTH_CALLBACK,
		nonce: randomString(32),
		//scopes: ["profile", "email", "openid"], @TODO dont need?
		//state: randomString(32) @TODO add? WordPress doesn't return state so errors out
	}) : {}

/*
 * @TODO check on token expiration.

 * When does authorization expire?
 * By default, every 48 hours.
 * The duration is in milliseconds.
 */
//const authExpiration = 172800000
/*if (Date.now() - token.date > authExpiration) {
	this.removeToken()
	return false
}*/

// Key we use to store the redirect path for after authentication.
const loginRedirectKey = "wpAuthRedirect"

const deleteAuthRedirect = () => {
	hasLocalStorage && localStorage.removeItem(loginRedirectKey)
}

export const setAuthRedirect = (redirect) => {
	hasLocalStorage && localStorage.setItem(loginRedirectKey, redirect)
}

export const getAuthRedirect = (deleteRedirect) => {
	const redirect = hasLocalStorage && localStorage.getItem(loginRedirectKey)
	if (true === deleteRedirect) {
		deleteAuthRedirect()
	}
	return redirect
}

// Returns access token if valid, false otherwise.
export const getAccessToken = () => {
	if (!isBrowser) {
		return false
	}
	let access = getAccessCookie()
	if (undefined === access || !access) {
		deleteAccessCookie()
		return false
	}
	return access
}

// Get our access cookie. Pass true to decrypt.
export const getAccessCookie = () => {
	const value = Cookies.get(authAccessCookieKey)
	if (undefined === value || !value) {
		return value
	}
	return decrypt(value)
}

// Store access token in cookie.
const setAccessCookie = (token, expires) => {

	let secure = true

	// For local builds.
	if (isBrowser && "http://localhost:8000" === window.location.origin) {
		secure = false
	}

	const encrypedToken = encrypt(token)
	Cookies.set(authAccessCookieKey, encrypedToken, {
		expires: expires,
		//domain: @TODO?
		secure: secure,
		sameSite: "strict"
	})
}

// Delete access token cookie.
const deleteAccessCookie = () => {
	return new Promise((resolve) => {
		Cookies.remove(authAccessCookieKey)
		resolve()
	})
}

// Delete session data.
const deleteSession = () => {
	return deleteAccessCookie()
}

// Store session data.
const setSession = (authResult, setUser) => {
	return new Promise((resolve, reject) => {

		if (authResult === undefined) {
			reject()
		}

		if (!authResult.user || !authResult.resource) {
			reject()
		}

		setAccessCookie(authResult.user.accessToken, authResult.user.expires)

		// Store user info.
		setUser(authResult.resource)

		resolve()
	})
}

export const handleLogout = (destroyUser) => {
	destroyUser()
	return deleteSession()
}

export const handleLogin = ({ user, setUser }) => {
	return new Promise((resolve) => {
		if (user.isLoggedIn()) {
			return resolve()
		}
		return validateToken({ setUser })
	})
}

const validateToken = ({ setUser }) => {
	return auth.code.getToken(window.location.href)
		.then(function (user) {

			const url = new URL(process.env.GATSBY_WPAUTH_ME)
			url.searchParams.append("access_token", user.accessToken)

			// Can only use one auth request method at a time.
			// Using an access token instead of the Authentication header.
			/* const request = user.sign({
				method: "get",
				url: url.toString()
			}) */

			return fetch(url.toString())
				.then(response => {
					return response.json()
				})
				.then(response => {
					return {
						user: user,
						resource: response
					}
				})
		})
		.then(response => {
			return setSession(response, setUser)
		})
		.catch(() => {
			// @TODO handle error?
			return deleteSession()
		})
}

const finishLoading = (dispatch) => {
	return dispatch(
		{
			type: "finishLoading",
		}
	)
}

// Don't silent auth for these routes.
const noAauthRoutes = ["/callback/", "/logout/"]

// Handles authentication "silently" in the background on app load.
export const silentAuth = (store) => {
	if (!isBrowser) {
		return finishLoading(store.dispatch)
	}

	if (noAauthRoutes.includes(window.location.pathname)) {
		return finishLoading(store.dispatch)
	}

	// If authenticated, returns the access key.
	const access = getAccessToken()
	if (!access) {
		return finishLoading(store.dispatch)
	}

	const userToken = auth.createToken(access, "", "code")

	const request = userToken.sign({
		method: "get",
		url: process.env.GATSBY_WPAUTH_ME
	})

	fetch(request.url, request)
		.then(response => {
			return response.json()
		})
		.then(response => {

			if (response.error) {
				throw response.error_description
			}

			store.dispatch(
				{
					type: "setUser",
					payload: {
						user: response
					}
				}
			)
		})
		.catch(() => {
			// @TODO handle error?
			return deleteSession()
		})
		.finally(() => {
			return finishLoading(store.dispatch)
		})
}

// Redirect to SSO login page.
export const login = () => {
	if (!isBrowser) {
		return
	}

	// Delay redirect a little so loading page doesn't flash.
	setTimeout(function () {
		window.location = auth.code.getUri()
	}, 500)
}

// Handles logout by redirecting to SSO.
export const logout = (access) => {

	const user = auth.createToken(access, "", "token", { expires: new Date() })

	const request = user.sign({
		method: "get",
		url: process.env.GATSBY_WPAUTH_LOGOUT,
	})

	fetch(request.url, request)
		.finally(() => {

			const prevPath = location.state && location.state.prevPath || null
			if (prevPath) {
				setAuthRedirect(prevPath)
			}

			navigate(process.env.GATSBY_WPAUTH_CALLBACK)
		})
}

// Displays the logout "button".
export const LogoutLink = ({ isPlain, isPrimary, redirectPath }) => {
	const buttonAttr = {
		to: "/logout/",
		className: "wpc-button wpc-button--logout",
	}
	if (isPrimary) {
		buttonAttr.className += " wpc-button--primary"
	} else if (isPlain) {
		buttonAttr.className += " wpc-button--plain"
	}
	if (redirectPath) {
		buttonAttr.state = { prevPath: redirectPath }
	}
	return <Link {...buttonAttr}>Logout</Link>
}

LogoutLink.propTypes = {
	isPlain: PropTypes.bool,
	isPrimary: PropTypes.bool,
	redirectPath: PropTypes.string,
}

LogoutLink.defaultProps = {
	isPlain: false,
	redirectPath: "/"
}