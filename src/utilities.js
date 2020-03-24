const sanitizeTwitterHandle = (handle) => {
	handle = handle.toLowerCase()
	return handle.replace(/[^a-z0-9_]/, "")
}

export { sanitizeTwitterHandle }
