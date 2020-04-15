import React, { useEffect } from "react"

import "./../css/footer.css"

const Footer = () => {
	useEffect(() => {
		import('@wpcampus/wpcampus-wc-footer')
	}, [])

	return <wpcampus-footer></wpcampus-footer>
}

export default Footer
