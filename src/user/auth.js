import messages from "./messages"

const tokenKey = "wpc-auth-token"

// Auth expires every 24 hours
// Duration in milliseconds
// @TODO update to something longer? The JWT plugin is set at a week.
const expDuration = 86400000

const removeJWTPrefix = message => {
  return message.replace(/^\[jwt_auth\]\s/, "")
}

export default class Auth {
  removeToken() {
    localStorage.removeItem(tokenKey)
  }

  storeToken(tokenValue) {
    let token = {
      token: tokenValue,
    }
    token.date = Date.now()
    localStorage.setItem(tokenKey, JSON.stringify(token))
    return token
  }

  getValidToken() {
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
    return new Promise((resolve, reject) => {
      this.removeToken()
      resolve(true)
    })
  }

  async login(username, password) {
    return new Promise((resolve, reject) => {
      let formData = new FormData()

      formData.append("username", username)
      formData.append("password", password)

      return fetch(process.env.WPC_URL_API + "/jwt-auth/v1/token", {
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
      return fetch(process.env.WPC_URL_API + "/wpcampus/auth/user", {
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
