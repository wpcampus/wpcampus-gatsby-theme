import React from "react"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-wc-conduct")
}

import "./../css/conduct.css"

const Conduct = () => {
	return (
		<wpcampus-conduct></wpcampus-conduct>
	)
}

export default Conduct
