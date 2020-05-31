/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import { SessionProvider } from "@wpcampus/wpcampus-auth"
export const wrapRootElement = SessionProvider
