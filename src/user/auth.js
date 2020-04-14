import messages from "./messages"

const tokenKey = "wpc-auth-token"

/*
 * Set the root URL for auth requests.
 */
const authRoot = "https://wpcampus.org/wp-json"

/*
 * When does authorization expire? By default, every 48 hours
 * The duration is in milliseconds.
 *
 * You can override this value by defining WPC_AUTH_DURATION in the .env file.
 */
const defaultDuration = 172800000
const expDuration =
	process.env.WPC_AUTH_DURATION &&
		Number.isInteger(process.env.WPC_AUTH_DURATION) &&
		process.env.WPC_AUTH_DURATION > 0 ? parseInt(process.env.WPC_AUTH_DURATION) : defaultDuration

const removeJWTPrefix = message => {
	return message.replace(/^\[jwt_auth\]\s/, "")
}

export default class Auth {
	removeToken() {
		typeof localStorage !== "undefined" && localStorage.removeItem(tokenKey)
	}

	storeToken(tokenValue) {
		if (typeof localStorage === "undefined") {
			return false
		}
		let token = {
			token: tokenValue,
		}
		token.date = Date.now()
		localStorage.setItem(tokenKey, JSON.stringify(token))
		return token
	}

	getValidToken() {
		if (typeof localStorage === "undefined") {
			return false
		}

		let token = localStorage.getItem(tokenKey)
		if (token === null) {
			return false
		}

		token = JSON.parse(token)

		if (token.token === null || token.date === null) {
			this.removeToken()
			return false
		}

		if (Date.now() - token.date > expDuration) {
			this.removeToken()
			return false
		}

		return token.token
	}

	async logout() {
		return new Promise((resolve) => {
			this.removeToken()
			resolve(true)
		})
	}

	async login(username, password) {
		return new Promise((resolve, reject) => {
			if (!authRoot) {
				reject(new Error(messages.missing_api))
			}

			let formData = new FormData()
			formData.append("username", username)
			formData.append("password", password)

			return fetch(authRoot + "/jwt-auth/v1/token", {
				method: "post",
				headers: new Headers({
					Accept: "application/json",
				}),
				body: formData,
			})
				.then(response => {
					return response.json()
				})
				.then(response => {
					if (!response.token) {
						let messageCode = removeJWTPrefix(response.code)
						if (messages[messageCode]) {
							throw new Error(messages[messageCode])
						} else {
							throw new Error(response.message)
						}
					}
					this.storeToken(response.token)
					resolve(response)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	async authenticate(token) {
		return new Promise((resolve, reject) => {
			if (!authRoot) {
				reject(new Error(messages.missing_api))
			}

			return fetch(authRoot + "/wpcampus/auth/user", {
				method: "get",
				headers: new Headers({
					Accept: "application/json",
					Authorization: "Bearer " + token,
				}),
			})
				.then(response => {
					return response.json()
				})
				.then(response => {
					if (response.code) {
						let messageCode = removeJWTPrefix(response.code)
						if (messages[messageCode]) {
							throw new Error(messages[messageCode])
						} else {
							throw new Error(response.message)
						}
					}
					response = {
						user: response,
						token: token,
					}
					resolve(response)
				})
				.catch(error => {
					reject(error)
				})
		})
	}
}
