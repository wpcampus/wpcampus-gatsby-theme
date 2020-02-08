/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import SEO from "./seo"
import Header from "./header"
import Footer from "./footer"
import WebComponent from "./webComponents"

import { User } from "../user/context"
import userDisplay from "../user/display"

import "./../css/layout.css"
import "./../css/main.css"

const Layout = ({ pageTitle, heading, children }) => {
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

  if (!pageTitle && heading) {
    pageTitle = heading
  }

  return (
    <>
      <SEO title={pageTitle} />
      <Header siteTitle={data.site.siteMetadata.title} />
      <WebComponent tag="wpcampus-notifications" />
      <main>
        <User.Consumer>{handleUserDisplay}</User.Consumer>
        {heading ? (<h1>{heading}</h1>) : null}
        {children}
      </main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  pageTitle: PropTypes.string,
  heading: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Layout
