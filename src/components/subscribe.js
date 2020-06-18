import React, { useEffect, useMemo } from "react"

const Subscribe = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-subscribe")
	}, [])

	return useMemo(() => {
		return <wpcampus-subscribe></wpcampus-subscribe>
	})
}

export default Subscribe
