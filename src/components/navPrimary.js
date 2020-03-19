import React, { useEffect } from "react"

import "./../css/nav.css"

import Nav from "./nav"
import navigation from "../js/nav-primary"

const NavPrimaryItems = [
	{ slug: "/", text: "Home" },
	{
		slug: "/blog/",
		text: "Blog",
		children: [{ slug: "/categories", text: "Categories" }],
	},
	{ slug: "/pages/", text: "Pages" },
	{ slug: "/contributors/", text: "Contributors" },
]

const NavPrimary = () => {
	useEffect(() => {
		navigation.init({
			breakpoint: 960,
			main: document.getElementById("main"),
			nav: document.getElementById("nav"),
			minHeights: false,
		})
	})

	const navPrimaryAttr = {
		id: "nav",
		classes: "wpc-nav wpc-nav--primary",
		list: NavPrimaryItems
	}

	return (
		<Nav {...navPrimaryAttr}>
			<button className="menu-toggle">Menu</button>
		</Nav>
	)
}

export default NavPrimary
