import React from "react"
import { handleAuthentication } from "../utils/auth"

const Callback = () => {
	handleAuthentication()
	// @TODO make this look prettier.
	return <p>Loading...</p>
}

export default Callback