import React from "react"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-wc-footer")
}

import "./../css/footer.css"

const Footer = () => {
	return (
		<wpcampus-footer></wpcampus-footer>
	)
}

export default Footer
