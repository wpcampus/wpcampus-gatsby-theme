import React, { useEffect } from "react"

import "./../css/conduct.css"

const Conduct = () => {
	useEffect(() => {
		import('@wpcampus/wpcampus-wc-conduct')
	}, [])

	return <wpcampus-conduct></wpcampus-conduct>
}

export default Conduct