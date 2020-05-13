import Cookies from "js-cookie"
import ClientOAuth2 from "client-oauth2"
import crypto from "crypto"
import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"

import wpcMember from "./member"

const authAccessCookieKey = "wpAuthAccess"
const algorithm = "aes-256-cbc"
const key = process.env.GATSBY_WPAUTH_CRYPTO_KEY
const iv = process.env.GATSBY_WPAUTH_CRYPTO_IV

const isBrowser = typeof window !== "undefined"

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
		accessTokenUri: process.env.GATSBY_WPAUTH_DOMAIN + "/token",
		authorizationUri: process.env.GATSBY_WPAUTH_DOMAIN + "/authorize",
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

// Will hold user data if logged in.
let loggedInUser = false

// Returns instance of logged in user.
export const getUser = () => {
	return loggedInUser
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

const loginRedirectKey = "wpAuthRedirect"

const deleteAuthRedirect = () => {
	localStorage.removeItem(loginRedirectKey)
}

export const setAuthRedirect = (redirect) => {
	localStorage.setItem(loginRedirectKey, redirect)
}

const getAuthRedirect = (deleteRedirect) => {
	const redirect = localStorage.getItem(loginRedirectKey)
	if (true === deleteRedirect) {
		deleteAuthRedirect()
	}
	return redirect
}

// Return true if "logged in".
export const isAuthenticated = () => {
	if (!isBrowser) {
		return false
	}
	let access = getAccessCookie(false)
	if (undefined === access || !access) {
		return false
	}
	return true
}

// Get our access cookie. Pass true to decrypt.
const getAccessCookie = (decryptToken) => {
	const value = Cookies.get(authAccessCookieKey)
	if (true === decryptToken) {
		return decrypt(value)
	}
	return value
}

// Store access token in cookie.
const setAccessCookie = (token, expires) => {

	let secure = true

	// For local builds.
	if (isBrowser && "http://localhost:9000" === window.location.origin) {
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
	Cookies.remove(authAccessCookieKey)
}

// Delete session data.
const deleteSession = () => {
	return new Promise((resolve) => {
		deleteAccessCookie()
		resolve()
	})
}

// Store user data.
const setUser = (resource) => {
	return new Promise((resolve) => {
		loggedInUser = new wpcMember(resource)
		resolve(loggedInUser)
	})
}

// Store session data.
const setSession = (authResult) => {
	return new Promise((resolve, reject) => {

		if (authResult === undefined) {
			reject()
		}

		if (!authResult.user || !authResult.resource) {
			reject()
		}

		// Store user info.
		setUser(authResult.resource)
			.then(() => {

				setAccessCookie(authResult.user.accessToken, authResult.user.expires)

				resolve()
			})
			.catch(error => {
				reject(error)
			})
	})
}

// Handles login authentication.
export const handleAuthentication = () => {
	if (!isBrowser) {
		return
	}

	const redirect = getAuthRedirect(true)

	// If no query parameters, then we're logging out.
	if (!window.location.search) {
		deleteSession()
			.then(() => {
				navigate(redirect || "/")
			})
	}

	// This means we're logging in.
	auth.code.getToken(window.location.href)
		.then(function (user) {

			const request = user.sign({
				method: "get",
				url: process.env.GATSBY_WPAUTH_DOMAIN + "/resource"
			})

			return fetch(request.url, request)
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
			setSession(response)
				.then(() => {
					navigate(redirect || "/")
				})
		})
		.catch(() => {
			// @TODO handle error?
			deleteSession()
				.then(() => {
					navigate(redirect || "/")
				})
		})
}

// Handles authentication "silently" in the background on app load.
export const silentAuth = callback => {
	if (!isAuthenticated()) return callback()

	let access = getAccessCookie(true)
	if (access != "") {

		/*
		 * @TODO do we need to refresh the token?
		 * I'm ok with asking for login again.
		 */
		//console.log(user.refresh())

		const user = auth.createToken(access, "", "code", { expires: new Date() })

		const request = user.sign({
			method: "get",
			url: process.env.GATSBY_WPAUTH_DOMAIN + "/resource"
		})

		fetch(request.url, request)
			.then(response => {
				return response.json()
			})
			.then(response => {

				if (response.error) {
					throw response.error_description
				}

				setUser(response).then(callback)
			})
			.catch(() => {
				// @TODO handle error
				deleteSession().then(callback)
			})
	}
}

// Handles logout by redirecting to SSO.
export const logout = (redirectPath) => {

	let access = getAccessCookie(true)
	if (access != "") {

		if (redirectPath) {

			// Never logout redirect to account page.
			if ("/account/" === redirectPath) {
				redirectPath = "/"
			}

			setAuthRedirect(redirectPath)
		}

		const user = auth.createToken(access, "", "token", { expires: new Date() })

		const request = user.sign({
			method: "get",
			url: process.env.GATSBY_WPAUTH_DOMAIN + "/logout",
		})

		window.location = request.url + "&redirect_uri=" + encodeURIComponent(process.env.GATSBY_WPAUTH_CALLBACK)

	}
}

// Displays the logout button.
export const LogoutButton = ({ isPlain, redirectPath }) => {
	const buttonAttr = {
		className: "wpc-button wpc-button--logout",
		onClick: (e) => {
			e.preventDefault()
			logout(redirectPath)
		}
	}
	if (isPlain) {
		buttonAttr.className += " wpc-button--plain"
	}
	return <button {...buttonAttr}>Logout</button>
}

LogoutButton.propTypes = {
	isPlain: PropTypes.bool,
	redirectPath: PropTypes.string,
}

LogoutButton.defaultProps = {
	isPlain: false,
	redirectPath: "/"
}