import React, { useEffect, useMemo } from "react"

import "../css/notifications.css"

const Notifications = () => {
	useEffect(() => {
		require("@wpcampus/wpcampus-wc-notifications")
	}, [])

	return useMemo(() => {
		return <wpcampus-notifications></wpcampus-notifications>
	})
}

export default Notifications
