import React, { useEffect, useMemo } from "react"

const Footer = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-footer")
	}, [])

	return useMemo(() => {
		return <wpcampus-footer></wpcampus-footer>
	})
}

export default Footer
