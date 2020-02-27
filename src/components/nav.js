import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const NavItem = ({ item }) => {
  return (
    <li>
      <Link activeClassName="nav-link--current" to={item.slug}>
        {item.text}
      </Link>
      {item.children && item.children.length ? (
        <ul>
          {item.children.map((child, i) => (
            <NavItem key={i} item={child} />
          ))}
        </ul>
      ) : (
        ""
      )}
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

const Nav = ({ id, classes, list, children }) => {
  const navAttr = {}
  if (id) {
    navAttr.id = id
  }
  if (classes) {
    navAttr.className = classes
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
  list: PropTypes.array.isRequired,
  children: PropTypes.object,
}

export default Nav
