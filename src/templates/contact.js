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
	pageContext: PropTypes.object.isRequired,
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
      title
      description
      labelPlacement
      subLabelPlacement
      descriptionPlacement
      button {
        type
        text
        imageUrl
      }
      cssClass
      version
      requireLogin
      requireLoginMessage
      is_active
      date_created
      is_trash
      formFields {
        type
        id
        label
        adminLabel
        isRequired
        size
        errorMessage
        nameFormat
        inputs {
          id
          label
          customLabel
          name
          placeholder
          defaultValue
          choices {
            text
            value
            isSelected
            price
          }
          isHidden
          inputType
        }
        labelPlacement
        descriptionPlacement
        subLabelPlacement
        placeholder
        enablePasswordInput
        multipleFiles
        maxFiles
        calculationFormula
        calculationRounding
        enableCalculation
        disableQuantity
        displayAllCategories
        inputMask
        inputMaskValue
        allowsPrepopulate
        formId
        pageNumber
        description
        inputType
        cssClass
        inputName
        noDuplicates
        defaultValue
        choices
        conditionalLogic
        visibility
        displayOnly
        useRichTextEditor
        fields
        inputMaskIsCustom
        maxLength
      }
    }
  }
`
