import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"
import ProtectedContent from "../components/content"
import Iframe from "@wpcampus/wpcampus-iframe"

const isDev = "development" === process.env.NODE_ENV

const WorkShopSurveyTemplate = props => {
	const page = props.data.wordpressPage
	const pageContext = props.pageContext

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		metaRobots: page.wpc_seo.meta.robots || [],
		heading: page.title,
		crumbs: pageContext.crumbs,
		path: props.path
	}

	const iframe1Attr = {
		id: "workshop",
		src: "https://wpcampus.org/forms/workshop-survey/",
		title: "Workshop survey",
		origins: [pageContext.formOrigin],
		resizeLog: isDev
	}

	const iframe2Attr = {
		id: "workshop-topics",
		src: "https://wpcampus.org/forms/workshop-topic-survey/",
		title: "Workshop topic survey",
		origins: [pageContext.formOrigin],
		resizeLog: isDev
	}

	const iframe3Attr = {
		id: "workshop-presenter",
		src: "https://wpcampus.org/forms/workshop-presenter-interest/",
		title: "Interest in being a workshop presenter form",
		origins: [pageContext.formOrigin],
		resizeLog: isDev
	}

	return (
		<Layout {...layoutAttr}>
			<ProtectedContent wpc_protected={pageContext.wpc_protected}>
				<div>{ReactHtmlParser(page.content)}</div>
				<h2 id="general">General workshop survey</h2>
				<p>Help us gather feedback on interest in our workshop initiative. You can use the other surveys to submit topics or interest in being a presenter.</p>
				<Iframe {...iframe1Attr} />
				<h2 id="topics">Submit workshop topics</h2>
				<p>Submit your own topics and help us gather feedback on which topics would be most benificial to the group.</p>
				<Iframe {...iframe2Attr} />
				<h2 id="lead">Lead a workshop</h2>
				<p>Are you interested in leading a workshop? Use this form to submit your interest, contact information, and which topics you would like to present on.</p>
				<Iframe {...iframe3Attr} />
			</ProtectedContent>
		</Layout>
	)
}

WorkShopSurveyTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default WorkShopSurveyTemplate

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      id
      wordpress_id
      slug
      date
      title
      status
      excerpt
      content
	  wpc_seo {
		  title
		  meta {
			  description
			  robots
		  }
	  }
    }
    site {
      siteMetadata {
        siteName
      }
    }
  }
`
