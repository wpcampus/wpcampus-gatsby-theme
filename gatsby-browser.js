/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import { UserContextProvider } from "./src/user/context"

export const wrapRootElement = ({ element }) => (
  <UserContextProvider>{element}</UserContextProvider>
)
