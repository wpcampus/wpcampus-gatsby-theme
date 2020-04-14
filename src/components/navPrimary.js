import React, { useEffect } from "react"

import "./../css/nav.css"

import { Nav, NavPrimaryItems } from "./nav"
import navigation from "../js/nav-primary"

const NavPrimary = () => {

	const navPrimaryID = "navPrimary"

	useEffect(() => {
		navigation.init({
			breakpoint: 960,
			main: document.getElementById("main"),
			nav: document.getElementById(navPrimaryID),
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
			<button className="menu-toggle">Menu</button>
		</Nav>
	)
}

export default NavPrimary
