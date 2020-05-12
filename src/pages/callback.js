import React from "react"

import { handleAuthentication } from "../utils/auth"
import LoadingLayout from "../components/loadingLayout"

const Callback = () => {

	const layoutAttr = {}

	// If no query parameters, then we're logging out.
	if (!window.location.search) {

		layoutAttr.message = "Logging you out"

		// Delay the authentication a little so loading page doesn't flash.
		setTimeout(function () {
			handleAuthentication()
		}, 1000)

	} else {
		handleAuthentication()
	}

	return <LoadingLayout {...layoutAttr} />
}

export default Callback