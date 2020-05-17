import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { connect } from "react-redux"
import { LogoutLink } from "../utils/auth"

import Layout from "../components/layout"
import LoadingLayout from "../components/loadingLayout"
import { AuthorCard } from "../components/author"
import { isBrowser } from "../utils/utilities"

//import slackLogo from "../svg/slack_logo.svg"
//import slackAvatarDefault from "../images/slack_avatar_default.png"

import "./../css/profile.css"

const mapStateToProps = ({ user, isLoading }) => {
	return { user, isLoading }
}

const ProfileTableRow = ({ th, td }) => {
	return <tr>
		<th>{th}</th>
		<td>{td}</td>
	</tr>
}

ProfileTableRow.propTypes = {
	th: PropTypes.string.isRequired,
	td: PropTypes.node
}

const InfoTable = ({ type, children, classes }) => {
	const tableAttr = {
		className: `wpc-table wpc-table--profile wpc-table--${type}`
	}
	if (classes) {
		tableAttr.className += ` ${classes}`
	}
	return <table {...tableAttr}>
		<tbody>
			{children}
		</tbody>
	</table>
}

InfoTable.propTypes = {
	type: PropTypes.string.isRequired,
	classes: PropTypes.string,
	children: PropTypes.node.isRequired
}

const PersonalInfo = ({ user }) => {
	return <InfoTable type="personal">
		<ProfileTableRow th="Username" td={user.getUsername()} />
		<ProfileTableRow th="First name" td={user.getFirstName()} />
		<ProfileTableRow th="Last name" td={user.getLastName()} />
		<ProfileTableRow th="Display name" td={user.getDisplayName()} />
		<ProfileTableRow th="Bio" td={user.getBio()} />
	</InfoTable>
}

PersonalInfo.propTypes = {
	user: PropTypes.object.isRequired
}

const ContactInfo = ({ user }) => {
	let website = user.getWebsite()
	if (website) {
		website = <a href={website}>{website}</a>
	}
	let twitter = user.getTwitter()
	if (twitter) {
		twitter = <a href={`https://twitter.com/${twitter}`}>{twitter}</a>
	}
	return <InfoTable type="contact">
		<ProfileTableRow th="Email" td={user.getEmail()} />
		<ProfileTableRow th="Website" td={website} />
		<ProfileTableRow th="Twitter" td={twitter} />
	</InfoTable>
}

ContactInfo.propTypes = {
	user: PropTypes.object.isRequired
}

const ProfessionalInfo = ({ user }) => {
	return <InfoTable type="professional">
		<ProfileTableRow th="Company" td={user.getCompany()} />
		<ProfileTableRow th="Position" td={user.getCompanyPosition()} />
	</InfoTable>
}

ProfessionalInfo.propTypes = {
	user: PropTypes.object.isRequired
}

/*const SlackIdentity = ({ user }) => {

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
			loggedInAs = <p>You are logged in as <strong>{slackUser.real_name_normalized} ({slackUser.name})</strong></p>
		} else if (slackUser.real_name_normalized) {
			loggedInAs = <p>You are logged in as <strong>{slackUser.real_name_normalized}</strong>.</p>
		} else if (slackUser.name) {
			loggedInAs = <p>You are logged in as <strong>{slackUser.name}</strong>.</p>
		}
	}

	const slackAuthURL = "https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=8624516180.919984917699&redirect_uri=https://wpcampus.org/slack/auth&state=loginWPCampusSlack&team=T08JCF65A"

	const login = <div className="wpc-slack-identity__login">
		<span>Connect your Slack account:</span>
		<a href={slackAuthURL} className="wpc-slack-identity__login__button">
			<img className="wpc-slack-identity__login__button_img" src="https://api.slack.com/img/sign_in_with_slack.png" alt="Connect your Slack account" />
		</a>
	</div>

	const logout = <div className="wpc-slack-identity__logout">
		<button className="wpc-slack-identity__logout__button" onClick={user.logoutSlack}>Remove Slack</button>
	</div>

	const slackAttr = {
		className: "wpc-slack-identity"
	}

	if (slackLoggedIn) {
		slackAttr.className += " wpc-slack-identity--loggedin"
	}

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
			{slackLoggedIn ? logout : login}
		</div>
	</div>
}

SlackIdentity.propTypes = {
	user: PropTypes.object.isRequired
}*/

const Home = ({ user }) => {

	const profileAttr = {
		className: "wpc-profile"
	}

	const firstName = user.getFirstName()
	const displayName = user.getDisplayName()
	const bio = user.getBio()
	const twitter = user.getTwitter()
	const website = user.getWebsite()
	const company = user.getCompany()
	const company_position = user.getCompanyPosition()

	let welcome
	if (firstName) {
		welcome = `Hi, ${firstName}!`
	} else {
		welcome = "Hi!"
	}

	/*<h2>Your Slack information</h2>
		<p>The majority of WPCampus conversations and interactions take place in <Link to="/community/slack/" aria-label="WPCampus Slack account">our Slack account</Link>.</p>
		<SlackIdentity user={user} />*/

	const authorCardAttr = {
		path: user.getUsername(),
		display_name: displayName,
		bio: bio,
		twitter: twitter,
		website: website,
		company: company,
		company_position: company_position
	}

	return <div {...profileAttr}>
		<p>{welcome}</p>
		<LogoutLink redirectPath="/" />
		<h2>Your personal information</h2>
		<PersonalInfo user={user} />
		<h2>Your contact information</h2>
		<ContactInfo user={user} />
		<h2>Your professional information</h2>
		<ProfessionalInfo user={user} />
		<h2>Your contributor card</h2>
		<AuthorCard author={authorCardAttr} headingLevel={3} />
	</div>
}

Home.propTypes = {
	user: PropTypes.object
}

const Account = ({ user, isLoading }) => {
	if (!isBrowser) {
		return <LoadingLayout />
	}

	// Silent auth is running.
	if (isLoading) {
		return <LoadingLayout />
	}

	if (!user.isLoggedIn()) {

		navigate(
			"/login/",
			{
				state: { prevPath: "/account/" },
			}
		)

		return <LoadingLayout />
	}

	// Don't index or follow.
	const metaRobots = ["nofollow", "noindex"]

	//const prevPath = isBrowser ? window.location.pathname : "/"

	/*<nav>
		<ul>
			<li><Link to="/account/" state={{ prevPath: prevPath }} rel="preload">Home</Link></li>
		</ul>
	</nav>*/

	return (
		<Layout heading="Your WPCampus profile" metaRobots={metaRobots}>
			<Router>
				<Home path="/account/" user={user} />
			</Router>
		</Layout>
	)
}

Account.propTypes = {
	user: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
}

// Connect this component to our provider.
const ConnectedAccount = connect(mapStateToProps)(Account)

export default ConnectedAccount