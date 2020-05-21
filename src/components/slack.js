import React from "react"
import PropTypes from "prop-types"

import slackLogo from "../svg/slack_logo.svg"
import slackAvatarDefault from "../images/slack_avatar_default.png"
import { isBrowser } from "../utils/utilities"

const wpSlackURL = `https://${process.env.WPC_WORDPRESS}/slack`

const getCurrentURL = () => {
	if (!isBrowser) {
		return ""
	}

	let redirect = window.location.href

	// Remove any query parameters.
	if (window.location.search) {
		redirect = redirect.replace(window.location.search, "")
	}

	return redirect

}

const getRedirectURL = (rootURL) => {

	let redirect = getCurrentURL()
	if (redirect) {
		rootURL += "?redirect_uri=" + encodeURIComponent(redirect)
	}

	return rootURL
}

const SlackLogin = () => {

	let loginURL = getRedirectURL(`${wpSlackURL}/login/`)

	return <div className="wpc-slack-identity__login">
		<span>Connect your WPCampus Slack account:</span>
		<a href={loginURL} className="wpc-slack-identity__login__button">
			<img className="wpc-slack-identity__login__button_img" src="https://api.slack.com/img/sign_in_with_slack.png" alt="Connect your WPCampus Slack account" />
		</a>
	</div>
}

const SlackLogout = () => {

	let logoutURL = getRedirectURL(`${wpSlackURL}/logout/`)

	const linkAttr = {
		href: logoutURL,
		className: "wpc-slack-identity__logout__button"
	}

	return <div className="wpc-slack-identity__logout">
		<a {...linkAttr}>Disconnect from Slack</a>
	</div>
}

const SlackIdentity = ({ user }) => {

	const slack = user.getSlack()
	const slackUser = slack.user && slack.user.id ? slack.user : false
	const slackLoggedIn = false !== slackUser

	let avatar, avatar_alt
	if (slackLoggedIn && slackUser.image_512) {
		avatar = slackUser.image_512
		avatar_alt = "Your Slack avatar"
	} else {
		avatar = slackAvatarDefault
		avatar_alt = ""
	}

	let loggedInAs
	if (slackLoggedIn) {
		if (slackUser.real_name_normalized && slackUser.name) {
			loggedInAs = `${slackUser.real_name_normalized} (${slackUser.name})`
		} else if (slackUser.real_name_normalized) {
			loggedInAs = slackUser.real_name_normalized
		} else if (slackUser.name) {
			loggedInAs = slackUser.name
		}

		if (loggedInAs) {
			loggedInAs = <p><strong>You are {loggedInAs}.</strong></p>
		}
	}

	const slackAttr = {
		className: "wpc-slack-identity"
	}

	if (slackLoggedIn) {
		slackAttr.className += " wpc-slack-identity--loggedin"
	}

	// @TODO display user's Slack status

	return <div {...slackAttr}>
		<div className="wpc-slack-identity__avatar">
			<img className="wpc-slack-identity__avatar__img" src={avatar} alt={avatar_alt} />
		</div>
		<div className="wpc-slack-identity__info">
			<div className="wpc-slack-identity__logo">
				<img className="wpc-slack-identity__logo__img" src={slackLogo} alt="Slack logo" />
			</div>
			<div className="wpc-slack-identity__user">
				<div className="wpc-slack-identity__user__name">{loggedInAs}</div>
				{slackUser.title ? <div className="wpc-slack-identity__user__bio">{slackUser.title}</div> : null}
			</div>
			{slackLoggedIn ? <SlackLogout /> : <SlackLogin />}
		</div>
	</div>
}

SlackIdentity.propTypes = {
	user: PropTypes.object.isRequired
}

export { SlackIdentity }