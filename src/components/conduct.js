import React, { useEffect } from "react"

import "./../css/conduct.css"

const Conduct = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-conduct")
	}, [])

	return <wpcampus-conduct></wpcampus-conduct>
}

export default Conduct