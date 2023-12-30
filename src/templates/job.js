import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

const Job = props => {
	const page = props.data.wordpressPage
	const job = props.data.allWordpressWpcJob.edges

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		metaRobots: page.wpc_seo.meta.robots || [],
		heading: page.title,
		sidebarBottom: true,
		crumbs: props.pageContext.crumbs,
		path: props.path
	}

	return <Layout {...layoutAttr}>
		{ReactHtmlParser(job.shortcode)}
	</Layout>
}

Job.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired,
	edges: PropTypes.array,
}

export default Job

// @TODO remove fields we're not using.
export const pageQuery = graphql`
  allWordpressWpcJob {
		edges {
		  	node {
					shortcode
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
