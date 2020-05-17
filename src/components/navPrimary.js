import React, { useEffect } from "react"

import { Nav, NavPrimaryItems } from "./nav"
import navigation from "../js/nav-primary"

import ToggleIcon from "../svg/toggleMenu"

const NavPrimary = () => {

	const navPrimaryID = "navPrimary"

	// @TODO add useRef
	useEffect(() => {

		const navPrimary = document.getElementById(navPrimaryID)

		document.body.classList.remove("menu-toggled-open")
		navPrimary.classList.remove("toggled-open")

		navigation.init({
			breakpoint: 920,
			main: document.getElementById("main"),
			nav: navPrimary,
			minHeights: false,
		})
	})

	const navPrimaryAttr = {
		id: navPrimaryID,
		classes: "wpc-nav wpc-nav--primary",
		aria_label: "Primary",
		list: NavPrimaryItems
	}

	return (
		<Nav {...navPrimaryAttr}>
			<button className="wpc-nav__toggle menu-toggle" aria-label="Toggle main menu">
				<ToggleIcon classes="wpc-nav__toggle__icon" />
				<div className="wpc-nav__toggle__labels">
					<div className="wpc-nav__toggle__label wpc-nav__toggle__label--open">Menu</div>
					<div className="wpc-nav__toggle__label wpc-nav__toggle__label--close">Close</div>
				</div>
			</button>
		</Nav>
	)
}

export default NavPrimary
