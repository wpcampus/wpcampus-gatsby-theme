/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import "./src/css/fonts.css"
import "./src/css/base.css"
import "./src/css/grid.css"
import "./src/css/body.css"
import "./src/css/loading.css"
import "./src/css/forms.css"
import "./src/css/slack.css"

import "./src/css/header.css"
import "./src/css/nav.css"
import "./src/css/notifications.css"
import "./src/css/sidebar.css"
import "@wpcampus/wpcampus-wc-conduct/dist/main.css"
import "@wpcampus/wpcampus-wc-footer/dist/main.css"

import SessionProvider from "./src/utils/provider"
export const wrapRootElement = SessionProvider