export default class wpcMember {
	constructor(props) {
		this.data = props
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