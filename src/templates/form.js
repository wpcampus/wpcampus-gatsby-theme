import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import Form from "../components/form"
import ProtectedContent from "../components/content"

const PageTemplate = props => {
	const page = props.data.wordpressPage
	const pageContext = props.pageContext

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		metaRobots: page.wpc_seo.meta.robots || [],
		heading: page.title,
		crumbs: pageContext.crumbs,
		path: props.path
	}

	// Get the first form.
	let form
	if (props.data.allGfForm.edges.length) {
		form = props.data.allGfForm.edges.shift().node
	}

	return (
		<Layout {...layoutAttr}>
			<ProtectedContent wpc_protected={pageContext.wpc_protected}>
				<div>{ReactHtmlParser(page.content)}</div>
				<Form data={form} />
			</ProtectedContent>
		</Layout>
	)
}

PageTemplate.propTypes = {
	pageContext: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
	path: PropTypes.string.isRequired,
}

export default PageTemplate

export const pageQuery = graphql`
  query($id: String!, $forms: [Int]) {
    site {
      siteMetadata {
        siteName
      }
	}
	wordpressPage(id: { eq: $id }) {
		id
		title
		content
		wpc_seo {
			title
			meta {
				description
				robots
			}
		}
	}
    allGfForm(filter: {formId: { in: $forms }}) {
		edges {
			node {
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
    }
  }
`
