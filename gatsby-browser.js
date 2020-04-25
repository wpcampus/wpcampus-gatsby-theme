/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import PropTypes from "prop-types"
import { UserContextProvider } from "./src/user/context"

import "./src/css/fonts.css"
import "./src/css/base.css"
import "./src/css/grid.css"
import "./src/css/body.css"
import "./src/css/forms.css"

export const wrapRootElement = ({ element }) => (
	<UserContextProvider>{element}</UserContextProvider>
)

wrapRootElement.propTypes = {
	element: PropTypes.object.isRequired
}
