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
import WebComponent from "./webComponents"

import { User } from "../user/context"

import "./../css/layout.css"
import "./../css/main.css"

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

  const userDisplay = user => {
    return (
      <div>
        {user.isAuthenticated ? (
          <div>
            <div>user is authenticated: {user.name}</div>
            <button onClick={user.handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={user.handleLogin}>Login</button>
        )}
      </div>
    )
  }

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <WebComponent tag="wpcampus-notifications" />
      <User.Consumer>{userDisplay}</User.Consumer>
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
