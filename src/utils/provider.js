import React from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import { createStore } from "redux"

import wpcMember from "./member"
import { silentAuth } from "./auth"

const initialState = {
	user: new wpcMember(),
	isLoading: true,
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "setUser": {

			// Is populated with user data.
			const { user } = action.payload

			// Replace with new user.
			const newUser = new wpcMember(user)

			// @TODO append, replace, or merge with user?
			return Object.assign({}, state, {
				user: newUser,
				isLoading: false
			})
		}
		case "finishLoading": {
			return Object.assign({}, state, {
				isLoading: false
			})
		}
		default:
			return state
	}
}

const sessionStore = () => createStore(reducer, initialState)

const SessionProvider = ({ element }) => {
	/*
	 * Instantiating store in `wrapRootElement` handler ensures:
	 * - there is fresh store for each SSR page
	 * - it will be called only once in browser, when React mounts
	 */
	const store = sessionStore()

	const providerAttr = {
		store: store,
	}
	
	// "Silently" check authentication when app loads.
	silentAuth(store)

	return <Provider {...providerAttr}>{element}</Provider>
}

SessionProvider.propTypes = {
	element: PropTypes.node
}

export default SessionProvider