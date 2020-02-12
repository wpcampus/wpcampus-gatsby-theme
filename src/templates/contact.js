import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Layout from "../components/layout"
import Form from "../components/form"
import ProtectedContent from "../components/content"

const PageTemplate = props => {
  return (
    <Layout heading="Contact WPCampus">
      <ProtectedContent wpc_protected={props.pageContext.wpc_protected}>
        <Form data={props.data.gfForm} />
      </ProtectedContent>
    </Layout>
  )
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
}

export default PageTemplate

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    gfForm(formId: { eq: 3 }) {
      formId
      cssClass
      formFields {
        id
        type
        label
        description
        descriptionPlacement
      }
    }
  }
`
