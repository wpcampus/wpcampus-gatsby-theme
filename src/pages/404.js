import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import { SearchLayout } from "../components/search"

import TruckSheep from "../svg/trucksheep"

import "./../css/trucksheep.css"

// @TODO add meta description?

// @TODO add back link to mascots when page is ready
//<Link to="/about/mascots/" aria-label="Learn more about Truck Sheep">
const NotFoundPage = () => {
	// Have to hard code 404 in case the dynamic 404 passes the URL location.
	return <Layout heading="Page not found" path="/404/">
		<TruckSheep />
		<SearchLayout includeSearchHeading={true}>
			<p>Hmm. The URL you visited does not seem to exist.</p>
			<p>Truck Sheep made sure we included our search form to help you find what you&apos;re looking for.</p>
			<p>If you need further assistance, please <Link to="/about/contact" aria-label="Contact us and let us know">let us know</Link>.</p>
		</SearchLayout>
	</Layout>
}

export default NotFoundPage
