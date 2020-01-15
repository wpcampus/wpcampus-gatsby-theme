import React from "react"

const User = React.createContext()
User.displayName = "WPCampusUser"

const initialState = {
  name: null,
  isAuthenticated: false,
  handleLogin: null,
  handleLogout: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "loginUser":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        name: action.payload.name,
      }
    case "logoutUser":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        name: action.payload.name,
      }
    default:
      return state
  }
}

const UserContextProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const login = () => {
    dispatch({
      type: "loginUser",
      payload: {
        isAuthenticated: true,
        name: "Roy",
      },
    })
  }
  const logout = () => {
    dispatch({
      type: "logoutUser",
      payload: {
        isAuthenticated: false,
        name: null,
      },
    })
  }
  return (
    <User.Provider
      value={{
        ...state,
        handleLogin: login,
        handleLogout: logout,
      }}
    >
      {props.children}
    </User.Provider>
  )
}

export { UserContextProvider, User }
