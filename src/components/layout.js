/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./../css/layout.css"
import "./../css/main.css"

if (typeof HTMLElement !== "undefined") {
  require("@wpcampus/wpcampus-web-components")
}

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <wpcampus-notifications></wpcampus-notifications>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()},{` `}
        <a href="https://www.wpcampus.org">WPCampus</a>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
