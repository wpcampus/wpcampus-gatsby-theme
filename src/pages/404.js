import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import { SearchLayout } from "../components/search"

import TruckSheep from "../svg/trucksheep"

const NotFoundPage = () => {

	// Have to hard code 404 in case the dynamic 404 passes the URL location.
	const layoutAttr = {
		heading:"Page not found",
		metaDescription: "Hmm. The URL you visited does not seem to exist.",
		metaRobots: ["nofollow", "noindex"],
		path: "/404/"
	}

	return <Layout {...layoutAttr}>
		<Link to="/about/mascots/" aria-label="Learn more about Truck Sheep"><TruckSheep /></Link>
		<SearchLayout includeSearchHeading={true}>
			<p>Hmm. The URL you visited does not seem to exist.</p>
			<p><Link to="/about/mascots/" aria-label="Learn more about Truck Sheep">Truck Sheep</Link> made sure we included our search form to help you find what you&apos;re looking for.</p>
			<p>If you need further assistance, please <Link to="/about/contact" aria-label="Contact us and let us know">let us know</Link>.</p>
		</SearchLayout>
	</Layout>
}

export default NotFoundPage
