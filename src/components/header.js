import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import "./../css/header.css"

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="header__container">
      <h1 className="header__siteTitle">
        <Link to="/">{siteTitle}</Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
