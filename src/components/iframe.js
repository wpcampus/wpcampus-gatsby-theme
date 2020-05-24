import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import iFrameResize from "iframe-resizer"

const Iframe = ({ id, src, origins, resize, resizeLog }) => {

	const iframeRef = useRef()

	const resizeOptions = {
		log: resizeLog,
		warningTimeout: 10000,
		resizedCallback: function (e) {
			e.iframe.parentNode.classList.remove("iframe-wrapper--loading")
		}
	}

	if (origins.length > 0) {
		resizeOptions.checkOrigin = origins
	}

	useEffect(() => {
		resize && iFrameResize.iframeResizer(resizeOptions, "#" + iframeRef.current.id)
	}, [])

	const iframeAttr = {
		ref: iframeRef,
		id: id,
		src: src,
		className: "iframe"
	}

	if (resize) {
		iframeAttr.className += " iframe--resize"
	}

	return <div className="iframe-wrapper iframe-wrapper--loading">
		<div className="iframe-wrapper__loading">
			<p>The form is loading.</p>
		</div>
		<iframe {...iframeAttr} />
	</div>
}

Iframe.defaultProps = {
	id: "formIframe",
	resize: true,
	origins: [],
	resizeLog: false,
}

Iframe.propTypes = {
	id: PropTypes.string,
	src: PropTypes.string.isRequired,
	resize: PropTypes.bool,
	origins: PropTypes.array,
	resizeLog: PropTypes.bool
}

export default Iframe
