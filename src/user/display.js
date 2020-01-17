import React from "react"

import LoginForm from "../user/loginForm"

const defaultArgs = {
  showLogin: false,
  showLogout: true,
}

const userDisplay = (user, args) => {
  args = {
    ...defaultArgs,
    ...args,
  }
  if (!user.isActive()) {
    return ""
  }
  return (
    <div>
      {user.isLoggedIn() ? (
        <div className="user-display">
          <div>User: {user.getDisplayName()}</div>
          {args.showLogout ? <button onClick={user.logout}>Logout</button> : ""}
        </div>
      ) : args.showLogin ? (
        <LoginForm />
      ) : (
        ""
      )}
    </div>
  )
}

export default userDisplay
