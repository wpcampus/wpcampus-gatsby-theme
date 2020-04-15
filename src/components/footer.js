import React, { useEffect, useMemo } from "react"

import "./../css/footer.css"

const Footer = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-footer")
	}, [])

	return useMemo(() => {
		return <wpcampus-footer></wpcampus-footer>
	})
}

export default Footer
