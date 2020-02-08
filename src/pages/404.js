import React from "react"

import Layout from "../components/layout"
import { NavPrimary } from "../components/nav"

const NotFoundPage = () => (
  <Layout pageTitle="404: Not found">
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    <NavPrimary />
  </Layout>
)

export default NotFoundPage
