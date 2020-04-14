import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

// @TODO remove search and pages menu item
const NavPrimaryItems = [
	{
		slug: "/about/",
		text: "About",
		children: [
			{ slug: "/about/contributors/", text: "Contributors" },
			{ slug: "/about/partners/", text: "Partners" },
			{ slug: "/about/mascots/", text: "Mascots" },
			{ slug: "/about/governance/", text: "Governance" },
			{ slug: "/about/guidelines/", text: "Guidelines" },
			{ slug: "/about/contact/", text: "Contact us" },
		]
	},
	{
		slug: "/blog/",
		text: "Our blog",
		children: [
			{
				slug: "/blog/categories/",
				text: "Categories"
			}
		]
	},
	{
		slug: "/community/",
		text: "Our community",
		children: [
			{
				slug: "/community/membership/",
				text: "Become a member"
			},
			{
				slug: "/community/slack/",
				text: "Slack",
				children: [
					{
						slug: "/community/slack/channels/",
						text: "Slack channels",
					}
				]
			},
			{
				slug: "/community/sme/",
				text: "Subject matter experts"
			},
			{
				slug: "/community/calendar/",
				text: "Calendar of events"
			},
			{
				slug: "/community/swag/",
				text: "Swag"
			}
		]
	},
	{
		slug: "/conferences/",
		text: "Our conferences",
		children: [
			{
				href: "https://2021.wpcampus.org/",
				text: "WPCampus 2021"
			},
			{
				href: "https://2020.wpcampus.org/",
				text: "WPCampus 2020"
			},
			{
				href: "https://2019.wpcampus.org/",
				text: "WPCampus 2019"
			},
			{
				href: "https://2018.wpcampus.org/",
				text: "WPCampus 2018"
			},
			{
				href: "https://2017.wpcampus.org/",
				text: "WPCampus 2017"
			},
			{
				href: "https://2016.wpcampus.org/",
				text: "WPCampus 2016"
			},
			{
				href: "https://online.wpcampus.org/",
				text: "WPCampus Online"
			}
		]
	},
	{ slug: "/learning/", text: "Learning" },
	{ slug: "/jobs/", text: "Job board" },
	{ slug: "/podcast/", text: "Podcast" },
	{ href: "https://shop.wpcampus.org/", text: "Shop" },
	{ slug: "/search/", text: "Search" },
	{ slug: "/pages/", text: "Pages" }
]

const NavLink = ({ item }) => {
	if (!item.slug || !item.text) {
		return ""
	}
	const isActiveParent = ({ isCurrent, isPartiallyCurrent }) => {
		const attrs = {
			className: "nav-link"
		}
		if (isCurrent) {
			attrs.className += " nav-link--current"
		} else if (isPartiallyCurrent) {
			attrs.className += " nav-link--current-parent"
		}
		return attrs
	}
	return (
		<Link getProps={isActiveParent} to={item.slug}>
			{item.text}
		</Link>
	)
}

NavLink.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavAnchor = ({ item }) => {
	if (!item.href || !item.text) {
		return ""
	}
	const anchorAttr = {
		href: item.href
	}
	if (item.classes) {
		anchorAttr.classes = item.classes
	}
	if (item["aria-label"]) {
		anchorAttr["aria-label"] = item["aria-label"]
	}
	if (item.title) {
		anchorAttr.title = item.title
	}
	if (item.target) {
		anchorAttr.target = item.target
	}
	return (<a {...anchorAttr}>{item.text}</a>)
}

NavAnchor.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavItem = ({ item }) => {
	return (
		<li className="nav-listitem">
			{item.slug ? <NavLink item={item} /> : <NavAnchor item={item} />}
			{item.children && item.children.length ? (
				<ul className="wpc-nav__sub">
					{item.children.map((child, i) => (
						<NavItem key={i} item={child} />
					))}
				</ul>
			) : ""}
		</li>
	)
}

NavItem.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavList = ({ list }) => {
	return (
		<ul>
			{list.map((item, i) => (
				<NavItem key={i} item={item} />
			))}
		</ul>
	)
}

NavList.propTypes = {
	list: PropTypes.array.isRequired,
}

const Nav = ({ id, classes, label, list, children }) => {
	const navAttr = {}
	if (id) {
		navAttr.id = id
	}
	if (classes) {
		navAttr.className = classes
	}
	if (label) {
		navAttr["aria-label"] = label
	}
	return (
		<nav {...navAttr}>
			{children}
			<NavList list={list} />
		</nav>
	)
}

Nav.propTypes = {
	id: PropTypes.string,
	classes: PropTypes.string,
	label: PropTypes.string,
	list: PropTypes.array.isRequired,
	children: PropTypes.object,
}

export { Nav, NavAnchor, NavPrimaryItems }
