import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const NavLink = ({ item }) => {
	if (!item.slug || !item.text) {
		return ""
	}
	return (
		<Link activeClassName="nav-link--current" to={item.slug}>
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
		<li>
			{item.slug ? <NavLink item={item} /> : <NavAnchor item={item} />}
			{item.children && item.children.length ? (
				<ul>
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

export default Nav
