import React from "react"
import PropTypes from "prop-types"
import { navigate, Link } from "gatsby"
import { Router } from "@reach/router"
import { connect } from "react-redux"
import { LogoutLink } from "../utils/auth"

import Layout from "../components/layout"
import LoadingLayout from "../components/loadingLayout"
import { AuthorCard } from "../components/author"
import { SlackIdentity } from "../components/slack"
import { isBrowser } from "../utils/utilities"

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

const AdminLink = ({ user }) => {
	if (user.hasCap("is_admin")) {

		const linkAttr = {
			href: `${process.env.GATSBY_WP_ADMIN}/`,
			className: "wpc-button wpc-button--secondary",
			"aria-label": "WordPress Admin dashboard",
			"title": "WordPress Admin dashboard",
		}

		return <a {...linkAttr}>Go to admin</a>
	}
	return null
}

AdminLink.propTypes = {
	user: PropTypes.object.isRequired
}

const EditProfileLink = ({ user }) => {
	if (user.hasCap("read")) {

		const linkAttr = {
			href: `${process.env.GATSBY_WP_ADMIN}/profile.php`,
			className: "wpc-button wpc-button--secondary",
			"aria-label": "Edit your WordPress user profile",
			"title": "Edit your WordPress user profile",
		}

		return <a {...linkAttr}>Edit profile</a>
	}
	return null
}

EditProfileLink.propTypes = {
	user: PropTypes.object.isRequired
}

const AccountButtons = ({ user, classes }) => {

	const buttons = []

	const adminLink = <AdminLink user={user} />
	if (adminLink) {
		buttons.push(adminLink)
	} else {

		const editProfile = <EditProfileLink user={user} />
		if (editProfile) {
			buttons.push(editProfile)
		}
	}

	const logoutLink = <LogoutLink redirectPath="/" isPrimary={true} />
	if (logoutLink) {
		buttons.push(logoutLink)
	}

	if (!buttons.length) {
		return null
	}

	const navAttr = {}
	if (classes) {
		navAttr.className = classes
	}

	return <nav {...navAttr}>
		<ul>
			{buttons.map((item, i) => (
				<li key={i}>
					{item}
				</li>
			))}
		</ul>
	</nav>
}

AccountButtons.propTypes = {
	user: PropTypes.object.isRequired,
	classes: PropTypes.string
}

const AccountMessages = () => {

	const messages = []

	// Build any messages for the user.
	if (isBrowser) {
		const search = window.location.search

		if (search.search("slackDisconnected=1") >= 0) {
			messages.push("You have disconnected your account with Slack.")
		} else if (search.search("slackConnected=1") >= 0) {
			messages.push("You have connected your account with Slack!")
		} else if (search.search("slackError=1") >= 0) {
			messages.push("There was a problem talking to Slack. Please try again.")
		}
	}

	if (!messages.length) {
		return null
	}

	// @TODO add ability to dismiss message.
	return <div className="wpc-profile__messages">
		<ul>
			{messages.map((message, i) => {
				return <li className="wpc-profile__message" key={i}>{message}</li>
			})}
		</ul>
	</div>
}

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

	const authorCardAttr = {
		path: user.getUsername(),
		display_name: displayName,
		bio: bio,
		twitter: twitter,
		website: website,
		company: company,
		company_position: company_position
	}

	// @TODO add edit profile form.
	return <div {...profileAttr}>
		<div className="wpc-profile__header">
			<p className="wpc-profile__header__welcome">{welcome}</p>
			<AccountButtons classes="wpc-profile__header__buttons" user={user} />
		</div>
		<AccountMessages />
		<h2>Your personal information</h2>
		<PersonalInfo user={user} />
		<h2>Your Slack information</h2>
		<p>The majority of WPCampus conversations and interactions take place in <Link to="/community/slack/" aria-label="WPCampus Slack account">our Slack account</Link>.</p>
		<SlackIdentity user={user} />
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