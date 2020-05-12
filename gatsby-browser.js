/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import PropTypes from "prop-types"
import { silentAuth } from "./src/utils/auth"

import "./src/css/fonts.css"
import "./src/css/base.css"
import "./src/css/grid.css"
import "./src/css/body.css"
import "./src/css/loading.css"
import "./src/css/forms.css"

class SessionCheck extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
		}
		this.handleCheckSession = this.handleCheckSession.bind(this)
	}

	handleCheckSession() {
		this.setState({ loading: false })
	}

	componentDidMount() {
		silentAuth(this.handleCheckSession)
	}

	render() {
		return (
			this.state.loading === false && (
				<React.Fragment>{this.props.children}</React.Fragment>
			)
		)
	}
}

SessionCheck.propTypes = {
	children: PropTypes.node
}

export const wrapRootElement = ({ element }) => (
	<SessionCheck>{element}</SessionCheck>
)

wrapRootElement.propTypes = {
	element: PropTypes.object.isRequired
}