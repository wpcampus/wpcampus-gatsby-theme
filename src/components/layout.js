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
import userDisplay from "../user/display"

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

  // Have to use separate function to process <User.Consumer> and pass args
  const handleUserDisplay = user => {
    const args = {
      showLogin: true,
    }
    return userDisplay(user, args)
  }

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <WebComponent tag="wpcampus-notifications" />
      <main>
        <User.Consumer>{handleUserDisplay}</User.Consumer>
        {children}
      </main>
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
