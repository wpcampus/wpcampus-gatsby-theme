import React from "react"

import { Nav } from "./nav"

const PodcastCallout = () => {
	return (
		<div>
			<p>The WPCampus Podcast is a recurring show where members of the community come together to discuss relevant topics, unique ways that WordPress is being used in Higher Education, share tutorials and walkthroughs, and more. <strong><em>If you&apos;d like to be a guest on the show, or have a topic you&apos;d like us to discuss, please <a href="/contact/">let us know</a>.</em></strong></p>
		</div>
	)
}

const PodcastActions = () => {
	const actionsAttr = {
		label: "Find the WPCampus podcast on other platforms",
		list: [
			{
				href: "https://open.spotify.com/show/0ULgPfGeMdkZYoRxkOJcMq?si=5_VGrpbnTd2CJIAx8yPWcQ",
				title: "Listen on Spotify",
				text: "Spotify"
			},
			{
				href: "https://itun.es/i6YF9HH",
				title: "Listen on iTunes",
				text: "iTunes"
			},
			{
				href: "https://play.google.com/music/listen?u=0#/ps/Imipnlywvba5v3lqu7y646dg6z4",
				title: "Listen on Google Play",
				text: "Google Play"
			},
			{
				href: "/feed/podcast",
				text: "RSS feed"
			}
		]
	}
	return (
		<Nav {...actionsAttr} />
	)
}

export { PodcastCallout, PodcastActions }
