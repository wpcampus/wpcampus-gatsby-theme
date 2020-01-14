import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const Nav = ({ list }) => (
  <nav>
    <ul>
      {list.map((item, i) => (
        <li key={i}>
          <Link to={item.slug}>{item.text}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

Nav.propTypes = {
  list: PropTypes.array.isRequired,
}

const NavPrimaryItems = [
  { slug: "/", text: "Home" },
  { slug: "/blog/", text: "Blog" },
  { slug: "/pages/", text: "Pages" },
]

const NavPrimary = () => <Nav list={NavPrimaryItems} />

export { Nav, NavPrimary }
