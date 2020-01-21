import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const NavItem = ({ item }) => {
  return (
    <li>
      <Link to={item.slug}>{item.text}</Link>
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

const Nav = ({ list }) => (
  <nav>
    <ul>
      {list.map((item, i) => (
        <NavItem key={i} item={item} />
      ))}
    </ul>
  </nav>
)

Nav.propTypes = {
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
  { slug: "/members/", text: "Members" },
]

const NavPrimary = () => <Nav list={NavPrimaryItems} />

export { Nav, NavPrimary }
