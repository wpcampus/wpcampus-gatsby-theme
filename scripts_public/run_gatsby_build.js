import { exec } from "child_process"
import crypto from "crypto"
import dotenv from "dotenv"
import express from "express"
import { createWriteStream } from "fs"
import https from "https"

dotenv.config()

const is_dev = process.env["NODE_ENV"] === "development"
const environment = is_dev ? "development" : "production"
const environment_hostname = is_dev ? "wpcampus.dev" : "wpcampus.org"
const environment_url = "https://" + environment_hostname

const hostname = "127.0.0.1"
const port = process.env["PORT_RUN_GATSBY_BUILD"]
const base_url = "http://" + hostname + ":" + port

const getDateTimestampFilename = (date) => {
	return date.toISOString().replace(/:/g, "-").replace(/\..*$/, "")
}

const getDateTimestamp = (date) => {
	return Math.floor(date / 1000)
}

const writeBuildLogFile = (
	build_uuid,
	build_start_date,
	build_end_date,
	status,
	body
) => {
	const filename =
		"logs/" + getDateTimestampFilename(build_start_date) + "-" + status + ".txt"

	// Prepend body with build information.
	body =
		"ID: " +
		build_uuid +
		"\n\nStart time: " +
		build_start_date.toISOString() +
		"\nEnd time: " +
		build_end_date.toISOString() +
		"\n\n" +
		body

	console.log("\n Creating log file:", filename)

	const writeStream = createWriteStream(filename)
	writeStream.write(body)
	writeStream.end()
}

const getBuildAuthToken = () => {
	return process.env["TOKEN_GATSBY_BUILD_AUTH"]
}

const reportSuccessfulBuild = (build_id, build_end_date) => {
	const build_auth_token = getBuildAuthToken()
	if (!build_auth_token) {
		throw new Error(
			"The server does not have the required authorization token to report a successful Gatsby build."
		)
	}

	const postData = "build_end_date=" + getDateTimestamp(build_end_date)

	const options = {
		hostname: environment_hostname,
		path:
			"/report_success_gatsby_build?gatsby_build_id=" +
			build_id +
			"&token=" +
			build_auth_token,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": postData.length,
		},
	}

	if (is_dev) {
		const wpc_staging_username = process.env["WPCAMPUS_STAGING_USERNAME"]
		if (!wpc_staging_username) {
			throw new Error(
				"The server does not have the required WPCampus staging username."
			)
		}

		const wpc_staging_password = process.env["WPCAMPUS_STAGING_PASSWORD"]
		if (!wpc_staging_password) {
			throw new Error(
				"The server does not have the required WPCampus staging password."
			)
		}

		const auth =
			"Basic " +
			Buffer.from(wpc_staging_username + ":" + wpc_staging_password).toString(
				"base64"
			)

		options.headers["Authorization"] = auth
	}

	console.log("\nReporting successful build to WPCampus for", build_id)
	console.log("Environment:", environment)
	console.log("Host:", environment_hostname)
	console.log("postData:", postData)

	const req = https.request(options, (response) => {
		console.log(`STATUS: ${response.statusCode}`)
		response.setEncoding("utf8")

		let data = ""
		response.on("data", (chunk) => {
			data = data + chunk.toString()
		})
		response.on("end", function () {
			console.log("The request is complete.")
			if (data) {
				console.log("The response:", data)
			} else {
				console.log("There was no response.")
			}
		})
		response.on("error", function (err) {
			console.log("Error with request", err)
		})
	})

	req.on("error", (e) => {
		console.error(`problem with request: ${e.message}`)
	})

	req.write(postData)
	req.end()
}

const validateRequest = function (request, response, next) {
	// This is covered by express but leaving in here just in case.
	if (request.method !== "POST") {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end("The POST method is required for this request.")
		return
	}

	const allowed_request_ip = process.env["RUN_GATSBY_BUILD_ALLOWED_IP"]
	if (!allowed_request_ip) {
		response.statusCode = 500
		response.setHeader("Content-Type", "text/plain")
		response.end("The server has not defined the allowed IP address.")
		return
	}

	if (request.headers["x-real-ip"] !== allowed_request_ip) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end("Your IP address is now allowed for this request.")
		return
	}

	if (!request.body) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end("The request does not contain a body.")
		return
	}

	const { host, author_id, author_name } = request.body
	if (!host) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end("The request body does not contain the request host.")
		return
	}

	if (!author_id) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end("The request body does not contain the author's user ID.")
		return
	}

	request.author_id = author_id
	request.author_name = author_name

	if (host !== environment_url) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end(
			`The build Gatsby app is running in ${environment} mode. Therefore, the request must come from ${environment_hostname}.`
		)
		return
	}

	const build_auth_token = getBuildAuthToken()
	if (!build_auth_token) {
		response.statusCode = 500
		response.setHeader("Content-Type", "text/plain")
		response.end("The server does not have the required authorization token.")
		return
	}

	const request_token = request.headers["authorization"]
	if (!request_token) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end(
			"The request does not contain the required authorization token."
		)
		return
	}

	if (request_token !== build_auth_token) {
		response.statusCode = 400
		response.setHeader("Content-Type", "text/plain")
		response.end(
			"The request does not contain the correct authorization token."
		)
		return
	}

	return next()
}

const processBuildRequest = function (request, response) {
	const build_start_date = new Date()
	const build_uuid = crypto.randomUUID()

	console.log("\nSomeone made a valid request to run the Gatsby build.")
	console.log("Build ID:", build_uuid)
	console.log("Build start time:", build_start_date.toISOString())
	console.log("Build author ID:", request.author_id)
	console.log("Build author name:", request.author_name)

	console.time("rungatsbybuild")

	if (!is_dev) {
		exec("npm run --prefix ../ build", (error, stdout, stderr) => {
			const build_end_date = new Date()
			if (error) {
				console.log("\n\nThere was an error with the build.")
				console.timeEnd("rungatsbybuild")
				writeBuildLogFile(
					build_uuid,
					build_start_date,
					build_end_date,
					"error",
					error.message
				)
				return
			}
			if (stderr) {
				console.log("\n\nThere was an stderr with the build.")
				console.timeEnd("rungatsbybuild")
				writeBuildLogFile(
					build_uuid,
					build_start_date,
					build_end_date,
					"error",
					stderr
				)
				return
			}

			console.timeEnd("rungatsbybuild")

			console.log("\n\nThe build was successful!")
			console.log("Build ID:", build_uuid)
			console.log("Build end time:", build_end_date.toISOString())

			writeBuildLogFile(
				build_uuid,
				build_start_date,
				build_end_date,
				"success",
				stdout
			)
			reportSuccessfulBuild(build_uuid, build_end_date)
		})
	} else {
		console.timeEnd("rungatsbybuild")
		reportSuccessfulBuild(build_uuid, new Date())
	}

	response.statusCode = 200
	response.setHeader("Content-Type", "application/json")
	response.end(
		JSON.stringify({
			build_id: build_uuid,
			build_start_date: getDateTimestamp(build_start_date),
			build_triggered: true,
			build_author_id: request.author_id,
			build_author_name: request.author_name,
			message: "The Gatsby build has been triggered.",
		})
	)
}

const app = express()

app.use(express.json())

app.post(
	"/2d44a87995db1b7f4cd4944daed4035",
	validateRequest,
	processBuildRequest
)

app.listen(port, hostname, () => {
	console.log(
		`"Run Gatsby Build for www.wpcampus.org" app is running in ${environment} mode at ${base_url}/`
	)
})
