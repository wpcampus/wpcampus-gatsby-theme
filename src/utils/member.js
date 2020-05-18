export default class wpcMember {
	constructor(props) {
		this.populate(props)
	}

	populate(props) {

		const userID = props !== undefined && props.ID ? parseInt(props.ID) : 0

		if (userID > 0) {
			this.authenticated = true
			this.data = props
		} else {
			this.authenticated = false
			this.data = {}
		}
	}

	// Returns true if user is logged in and has data.
	isLoggedIn() {
		return this.isAuthenticated() && this.exists()
	}

	isAuthenticated() {
		return this.authenticated === true
	}

	exists() {
		return this.getID() > 0
	}

	// Returns true if the user has a specific capability.
	hasCap(capability) {
		if (!this.isLoggedIn() || !this.exists()) {
			return false
		}
		if (!this.data.capabilities || !Object.prototype.hasOwnProperty.call(this.data.capabilities, capability)) {
			return false
		}
		return true === this.data.capabilities[capability]
	}

	getID() {
		const ID = this.data.ID ? parseInt(this.data.ID) : 0
		return ID > 0 ? ID : 0
	}

	getDisplayName() {
		return this.data.display_name || null
	}

	getUsername() {
		return this.data.username || null
	}

	getFirstName() {
		return this.data.first_name || null
	}

	getLastName() {
		return this.data.last_name || null
	}

	getEmail() {
		return this.data.email || null
	}

	getBio() {
		return this.data.bio || null
	}

	getWebsite() {
		return this.data.website || null
	}

	getTwitter() {
		return this.data.twitter || null
	}

	getCompany() {
		return this.data.company || null
	}

	getCompanyPosition() {
		return this.data.company_position || null
	}
}