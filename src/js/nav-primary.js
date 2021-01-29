/* global define */
((root, factory) => {
	if (typeof define === "function" && define.amd) {
		define([], factory)
	} else if (typeof exports === "object") {
		module.exports = factory()
	} else {
		root.navigation = factory()
	}
})(typeof self !== "undefined" ? self : this, () => {
	"use strict"

	const KEYMAP = {
		ESC: 27,
		TAB: 9,
	}

	// Object for public APIs.
	const navigation = {}

	// Placeholder for defaults merged with user settings.
	let settings

	// Default settings.
	const defaults = {
		breakpoint: 960,
		main: null,
		nav: null,
		orientation: "vertical",
		position: 0,
		minHeights: true,
	}

	// Object for keeping track of the `nav` element's scroll state.
	const navScrollState = {
		position: 0,
		top: 0,
	}

	/**
	 * Merges user options with the default settings.
	 * @private
	 * @param {Object} defaults Default settings.
	 * @param {Object} options  User settings.
	 */
	const extendDefaults = (defaults, options) => {
		let property

		for (property in options) {
			if (Object.prototype.hasOwnProperty.call(options, property)) {
				defaults[property] = options[property]
			}
		}

		return defaults
	}

	/**
	 * Updates the `button` element used for toggling the display of the menu.
	 * @private
	 */
	const updateMenuToggle = () => {
		const menuToggle = settings.nav.querySelector(".menu-toggle")

		menuToggle.classList.add("js-menu-toggle")

		menuToggle.setAttribute("aria-expanded", "false")

		// Revisit for translation and internationalization.
		menuToggle.setAttribute("aria-label", "Open menu")
	}

	/**
	 * Returns the `button` element to use for toggling the display of submenus.
	 * @private
	 */
	const getSubmenuToggle = () => {
		const toggleButton = document.createElement("button")

		toggleButton.classList.add("submenu-toggle", "js-submenu-toggle")

		// Revisit for translation and internationalization.
		toggleButton.setAttribute("aria-label", "Toggle child menu")

		toggleButton.setAttribute("aria-expanded", "false")

		return toggleButton
	}

	/**
	 * Adds `button` elements for toggling the display of submenus.
	 * @private
	 */
	const addSubmenuToggles = () => {
		const menu = settings.nav.querySelector("ul")

		// Get the submenus.
		const submenus = menu.querySelectorAll("ul")

		// Return early if there are no submenus.
		if (!submenus.length) return

		// Create the toggle button.
		const toggleButton = getSubmenuToggle()

		// Add a toggle button for each submenu.
		submenus.forEach(submenu => {
			if (submenu.parentNode.querySelector(".js-submenu-toggle")) return

			// Get parent link.
			const submenuParentLink = submenu.previousSibling

			// Create a span wrapper.
			const toggleSpan = document.createElement("span")
			toggleSpan.classList.add("nav-link--toggle")
			toggleSpan.appendChild(submenuParentLink)

			// Create a toggle button for the submenu.
			const thisToggleButton = toggleButton.cloneNode(true)

			// Add the toggle button to the span.
			toggleSpan.appendChild(thisToggleButton)

			// Add the span before the submenu.
			submenu.parentNode.insertBefore(toggleSpan, submenu)

			// If a parent menu is active, toggle the submenu.
			if (submenuParentLink.classList.contains("nav-link--current")) {
				toggleSubmenu(thisToggleButton, true)
			} else if (submenuParentLink.classList.contains("nav-link--current-parent")) {

				// If a submenu parent is a current parent, let the <li> know and toggle the submenu.
				submenuParentLink.parentNode.parentNode.classList.add("nav-listitem--current-parent")
				toggleSubmenu(thisToggleButton, true)
			}
		})

		menu.classList.add("has-submenu-toggle", "js-has-submenu-toggle")
	}

	/**
	 * Returns first focusable element in the container.
	 *
	 * @param {Object} container
	 * @param {string} focusSelector
	 * @return {Object} element
	 */
	const getfirstFocusableElement = (container, focusSelector) => {
		const focusableElements = container.querySelectorAll(focusSelector)
		return focusableElements[0]
	}

	/**
	 * Returns last focusable element in the container.
	 * 
	 * @param {Object} container
	 * @param {string} focusSelector
	 * @return {Object} element
	 */
	const getlastFocusableElement = (container, focusSelector) => {
		const focusableElements = container.querySelectorAll(focusSelector)
		return focusableElements[focusableElements.length - 1]
	}

	/**
	 * Handles keyboard navigation of the "mobile" menu.
	 *
	 * @param {*} event 
	 */
	const navKeyDown = (event) => {

		switch (event.keyCode) {

			// ESC
			case KEYMAP.ESC: {

				let toggle = settings.nav.querySelector(".menu-toggle")

				// Close the "mobile" menu.
				toggleMenu(toggle, false)
				toggle.focus()
				break
			}

			// TAB
			case KEYMAP.TAB: {

				// Which elements are focus-able in the nav.
				let focusSelector = "a, button"

				if (event.shiftKey) {

					// Means we're tabbing out of the beginning of the submenu.
					if (document.activeElement === getfirstFocusableElement(settings.nav, focusSelector)) {
						event.preventDefault()
						getlastFocusableElement(settings.nav, focusSelector).focus()
					}

					// Means we're tabbing out of the end of the submenu.
				} else if (document.activeElement === getlastFocusableElement(settings.nav, focusSelector)) {
					event.preventDefault()
					getfirstFocusableElement(settings.nav, focusSelector).focus()
				}
				break
			}
		}
	}

	/**
	 * Toggles classes and attributes used for handling the display of the menu.
	 *
	 * @private
	 * @param {Event}  event    The click event target.
	 * @param {Boolean} expand True if we're expanding.
	 */
	const toggleMenu = (target, expand) => {

		const expandStr = true === expand ? "true" : "false"
		target.setAttribute("aria-expanded", expandStr)

		document.body.classList.toggle("menu-toggled-open")

		settings.nav.classList.toggle("toggled-open")

		if (expand) {
			document.addEventListener("keydown", navKeyDown)
		} else {
			document.removeEventListener("keydown", navKeyDown)
		}
	}

	/**
	 * Toggles classes and attributes used for handling the display of submenus.
	 * @private
	 * @param {Event}  target   The click event target.
	 * @param {Boolean} expand True if we're expanding.
	 */
	const toggleSubmenu = (target, expand) => {

		const expandStr = true === expand ? "true" : "false"
		target.setAttribute("aria-expanded", expandStr)

		target.parentNode.parentNode.classList.toggle("toggled-open")

		//resizeHandler()

		//positionNav()
	}

	/**
	 * Handles click events on the navigation element.
	 * @private
	 * @param {Event} event The click event.
	 */
	const clickHandler = event => {
		const target = event.target
		const expanded =
			"false" === target.getAttribute("aria-expanded") ? false : true

		if (target.classList.contains("js-menu-toggle")) {
			toggleMenu(target, !expanded)
		}

		if (target.classList.contains("js-submenu-toggle")) {
			toggleSubmenu(target, !expanded)
		}
	}

	/**
	 * Ensures that the appropriate attributes and classes are in place
	 * on either side of the mobile styling breakpoint.
	 * @private
	 */
	const resizeHandler = () => {
		// Return early if there is no breakpoint setting.
		if (!settings.breakpoint) return

		if (settings.breakpoint > window.innerWidth) {
			settings.main.style.minHeight = ""
			settings.nav.style.minHeight = ""
		} else {
			settings.nav.classList.remove("toggled-open")
			document.body.classList.remove("menu-toggled-open")

			const menuToggle = settings.nav.querySelector(".menu-toggle")

			if (menuToggle) {
				menuToggle.setAttribute("aria-expanded", "false")
				menuToggle.setAttribute("aria-label", "Open menu")
			}

			// Set `min-height` values for both the `main` and `nav` elements if appropriate.
			/*if ("vertical" === settings.orientation && settings.minHeights) {
				const navHeight = settings.nav.querySelector("ul").scrollHeight
				const windowHeight = window.innerHeight
				const minHeight =
					navHeight > windowHeight ? navHeight + "px" : windowHeight + "px"

				settings.main.style.minHeight = minHeight
				settings.nav.style.minHeight = minHeight
			}*/
		}
	}

	/**
	 * Ensures proper positioning of the navigation when the page scrolled.
	 * @private
	 */
	const positionNav = () => {
		const windowTop = window.pageYOffset
		const bottomedOut =
			window.innerHeight + windowTop >= document.body.offsetHeight
		const scrollDiff = navScrollState.top - windowTop
		const upperBound = (settings.nav.scrollHeight - window.innerHeight) * -1

		let position = navScrollState.position

		// Within the upper bounds, calculate the position based on scroll location.
		position = position + scrollDiff

		// If the position is greater than the default, reset it to the default.
		// This prevents scrolling too far up.
		if (settings.position < position) {
			position = settings.position
		}

		// If the position is outside of the upper bound, reset it to the upper bound.
		// This prevents scrolling too far down.
		if (position < upperBound || bottomedOut) {
			position = upperBound
		}

		navScrollState.position = position
		navScrollState.top = windowTop

		settings.nav.style.top = position + "px"
	}

	/**
	 * Ensures that the `positionNav` function fires only when needed,
	 * and uses the `requestAnimationFrame` method for optimal performance.
	 * @private
	 */
	const scrollHandler = () => {
		if (
			(!settings.breakpoint || settings.breakpoint < window.innerWidth) &&
			settings.main.offsetHeight > settings.nav.scrollHeight &&
			window.innerHeight < settings.nav.scrollHeight + settings.position
		) {
			requestAnimationFrame(positionNav)
		}
	}

	/**
	 * Toggles the `focus` class for menu items with submenus.
	 * @private
	 * @param {Event} event The focus or blur event.
	 */
	const focusHandler = event => {
		if ("A" !== event.target.tagName) return

		let item = event.target

		while (!item.classList.contains("js-has-submenu-toggle")) {
			// Toggle the `focus` class on `li` elements.
			if ("LI" === item.tagName) {
				if (item.classList.contains("focus")) {
					item.classList.remove("focus")
				} else {
					item.classList.add("focus")
				}
			}

			item = item.parentElement
		}
	}

	/**
	 * Destroys the current initialization.
	 * @public
	 */
	navigation.destroy = () => {
		// If plugin isn't already initialized, stop.
		if (!settings) return

		// Remove event listeners.
		settings.nav.removeEventListener("click", clickHandler, false)

		/*if ("vertical" === settings.orientation) {
			window.addEventListener("resize", resizeHandler, true)
			window.removeEventListener("scroll", scrollHandler, true)
		}*/

		// Reset variables.
		settings = null
	}

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 * @param {Object}  options             User settings.
	 * @param {Number}  options.breakpoint  Pixel width at which the navigation is styled for mobile devices. Defaults to `null`
	 * @param {Object}  options.main        The element containing the page's content. Required. Defaults to `null`.
	 * @param {Boolean} options.minHeights  Whether the plugin should set min heights on the main and nav elements. Defaults to `true`.
	 * @param {Object}  options.nav         The element containing the navigation. Required. Defaults to `null`.
	 * @param {String}  options.orientation The orientation of the navigation. Accepts `vertical` or `horizontal`. Defaults to `vertical`.
	 * @param {Number}  options.position    Initial `top` value of the navigation element from CSS, if set. Defaults to `0`.
	 */
	navigation.init = options => {
		// Check for required settings.
		if (!options.nav || !options.main) return

		// Destroy any existing initializations.
		navigation.destroy()

		// Merge user options with defaults.
		settings = extendDefaults(defaults, options || {})

		updateMenuToggle()

		const menuItems = settings.nav.querySelectorAll("ul > li > a")
		menuItems.forEach(item => {
			if (item.classList.contains("nav-link--current")) {
				item.parentNode.classList.add("nav-listitem--current")
			}
		})

		addSubmenuToggles()

		//resizeHandler()

		// Listen for click events on the navigation element.
		settings.nav.addEventListener("click", clickHandler, false)

		// Listen for resize events.
		//window.addEventListener("resize", resizeHandler, true)

		/*if ("vertical" === settings.orientation) {
			window.addEventListener("scroll", scrollHandler, true)
		}

		if ("horizontal" === settings.orientation) {
			settings.nav.addEventListener("focus", focusHandler, true)
			settings.nav.addEventListener("blur", focusHandler, true)
		}*/
	}

	return navigation
})
