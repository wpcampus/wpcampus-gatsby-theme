import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { silentAuth } from "./src/utils/auth"

const SessionCheck = ({ children }) => {
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		silentAuth(function () {
			setLoading(false)
		})
	}, [])
	return (
		loading === false && (
			<React.Fragment>{children}</React.Fragment>
		)
	)
}

SessionCheck.propTypes = {
	children: PropTypes.node
}

export default SessionCheck