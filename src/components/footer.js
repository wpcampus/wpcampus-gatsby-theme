import React from "react"

//import "./../css/footer.css"

const Footer = () => {
	return (
		<footer className="wpc-footer wpc-wrapper">
			<div className="wpc-container">
				<div className="wpc-area">
					© {new Date().getFullYear()},{" "}
					<a href="https://www.wpcampus.org">WPCampus</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
