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

const Nav = ({ classes, list }) => {
  const navAttr = {}
  if (classes) {
    navAttr.className = classes
  }
  return (
    <nav {...navAttr}>
      <ul>
        {list.map((item, i) => (
          <NavItem key={i} item={item} />
        ))}
      </ul>
    </nav>
  )
}

Nav.propTypes = {
  classes: PropTypes.string,
  list: PropTypes.array.isRequired,
}

const NavPrimaryItems = [
  { slug: "/", text: "Home" },
  {
    slug: "/blog/",
    text: "Blog",
    children: [{ slug: "/categories", text: "Categories" }],
  },
  { slug: "/pages/", text: "Pages" },
  { slug: "/contributors/", text: "Contributors" },
  //{ slug: "/members/", text: "Members" },
]

const NavPrimary = () => {
  return (
    <div className="nav--primary">
      <Nav list={NavPrimaryItems} />
    </div>
  )
}

export { Nav, NavPrimary }
