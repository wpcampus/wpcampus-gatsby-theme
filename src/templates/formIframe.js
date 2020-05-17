import React, { useEffect } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import ProtectedContent from "../components/content"

import iFrameResize from "iframe-resizer"

const isDev = "development" === process.env.NODE_ENV

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

	const forms = pageContext.forms || []

	const form = forms.length ? forms[0] : null

	let iframe, iframeID
	if (form) {
		iframeID = "formIframe"

		const iframeAttr = {
			id: iframeID,
			src: form,
			className: "iframe iframe--resize"
		}

		iframe = <div className="iframe-wrapper iframe-wrapper--loading">
			<div className="iframe-wrapper__loading">
				<p>The form is loading.</p>
			</div>
			<iframe {...iframeAttr} />
		</div>
	}

	const origins = [pageContext.formOrigin]

	useEffect(() => {
		iFrameResize.iframeResizer({
			log: isDev,
			checkOrigin: origins,
			warningTimeout: 10000,
			resizedCallback: function (e) {
				e.iframe.parentNode.classList.remove("iframe-wrapper--loading")
			}
		}, "#" + iframeID)
	}, [])

	return (
		<Layout {...layoutAttr}>
			<ProtectedContent wpc_protected={pageContext.wpc_protected}>
				<div>{ReactHtmlParser(page.content)}</div>
				{form ? iframe : ""}
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
  query($id: String!) {
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
  }
`