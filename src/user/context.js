/**
 * This functionality requires the following plugins
 * on the WordPress website to handle user authentication:
 *
 * - JWT Authentication for WP-API
 * - WPCampus: Authentication plugin
 */

import React from "react"
import PropTypes from "prop-types"
import Auth from "./auth"
import messages from "./messages"

const auth = new Auth()

const User = React.createContext()
User.displayName = "WPCampusUser"

const initialState = {
	active: false,
	user: null,
	token: null,
	isLoggedIn: null,
	login: null,
	logout: null,
}

const reducer = (state, action) => {
	switch (action.type) {
		case "updateUser":
			var newState = {}
			if (action.payload.user !== undefined) {
				newState.user = action.payload.user
			}
			if (action.payload.token !== undefined) {
				newState.token = action.payload.token
			}
			if (
				action.payload.active !== undefined &&
				action.payload.active === true
			) {
				newState.active = true
			}
			return {
				...state,
				...newState,
			}
		default:
			return state
	}
}

const UserContextProvider = props => {
	const [state, dispatch] = React.useReducer(reducer, initialState)

	const getToken = () => {
		if (!state.token) {
			return false
		}
		return state.token
	}

	const isLoggedIn = () => {
		const token = getToken()
		if (false === token) {
			return false
		}
		const user = getUserInfo()
		return false !== user
	}

	const login = async (username, password) => {
		return new Promise((resolve, reject) => {
			return auth
				.login(username, password)
				.then(response => {
					// Something went wrong if we dont have a token.
					if (!response.token) {
						throw new Error(messages.login_error)
					}

					dispatch({
						type: "updateUser",
						payload: {
							active: true,
							user: response.user,
							token: response.token,
						},
					})

					resolve(response)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const logout = async () => {
		return auth
			.logout()
			.then(result => {
				// Will be false if logout had an issue.
				if (!result) {
					throw new Error(messages.logout_error)
				}

				dispatch({
					type: "updateUser",
					payload: {
						active: true,
						user: null,
						token: null,
					},
				})
			})
		/*.catch(error => {
			// @TODO handle error?
			//console.error(error.message)
		})*/
	}

	// Runs when the page loads to see if the user is logged in.
	const authenticate = async () => {
		const payload = {
			user: null,
			token: null,
		}
		return new Promise((resolve, reject) => {
			const token = auth.getValidToken()

			// We dont have a token so not logged in.
			if (false === token) {
				return resolve(payload)
			}

			let user = getUserInfo()

			// We have a token and user info so all good to go.
			if (false !== user) {
				payload.user = user
				payload.token = token
				return resolve(payload)
			}

			// We have a token but need to get user info.
			return auth
				.authenticate(token)
				.then(response => {
					resolve(response)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	// Let's get things started. Will set the context to active.
	if (!isActive()) {
		authenticate()
			.then(response => {
				dispatch({
					type: "updateUser",
					payload: {
						active: true,
						user: response.user,
						token: response.token,
					},
				})
			})
			.catch(() => {
				// @TODO handle error?
				//console.error(error.message)

				logout()
			})
	}

	const provider = {
		...state,
		getUsername: getUsername,
		getFirstName: getFirstName,
		getLastName: getLastName,
		getEmail: getEmail,
		getWebsite: getWebsite,
		getTwitter: getTwitter,
		getBio: getBio,
		getCompany: getCompany,
		getCompanyPosition: getCompanyPosition,
		isLoggedIn: isLoggedIn,
		login: login,
		logout: logout,
	}

	return (
		<User.Provider value={provider}>
			{props.children}
		</User.Provider>
	)
}

UserContextProvider.propTypes = {
	children: PropTypes.node
}

export { UserContextProvider, User }
