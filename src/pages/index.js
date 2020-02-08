import React from "react"

import Layout from "../components/layout"
import Image from "../components/image"

const IndexPage = () => (
  <Layout heading="Home">
    <p>WPCampus is a community of web professionals, educators, and people dedicated to advancing higher education by providing support, resources, and training focused on open source web publishing technologies.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage
