import React, { useEffect, useMemo } from "react"

import "./../css/conduct.css"

const Conduct = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-conduct")
	}, [])

	return useMemo(() => {
		return <wpcampus-conduct></wpcampus-conduct>
	})
}

export default Conduct
