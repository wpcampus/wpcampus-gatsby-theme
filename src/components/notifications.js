import React from "react"

if (typeof HTMLElement !== "undefined") {
	require("@wpcampus/wpcampus-wc-notifications")
}

import "../css/notifications.css"

const Notifications = () => {
	return (
		<wpcampus-notifications></wpcampus-notifications>
	)
}

export default Notifications
