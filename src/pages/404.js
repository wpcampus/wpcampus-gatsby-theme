import React from "react"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"

const NotFoundPage = () => (
  <Layout heading="Page not found">
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    <NavPrimary />
  </Layout>
)

export default NotFoundPage
