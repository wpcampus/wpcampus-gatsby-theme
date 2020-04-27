import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

/*
 * Set the root URL for API requests.
 *
 * Environment variables are only accessible in development.
 */
const isDev = "development" === process.env.NODE_ENV
const entriesAPIRoot = isDev ? process.env.WPC_API : "https://wpcampus.org/wp-json"
const entriesAPI = `${entriesAPIRoot}/gf/v2/entries`

/*
 * @TODO:
 * - Add action
 */
const Form = ({ data, token }) => {
	const initialState = {
		formErrors: [],
		processing: false,
		formData: data,
		formEntry: {},
	}
	const [state, setState] = useState(initialState)

	let { formData, formErrors, formEntry } = state

	if (!formData.formId) {
		return null
	}

	if (!formData.is_active || "1" === formData.is_trash) {
		return null
	}

	const formId = formData.formId
	const formName = `gForm${formId}`
	const formFields = formData.formFields

	const formPrefix = "gform"
	const formIdPrefix = `${formPrefix}-${formId}`

	const formProcessingCSS = `${formPrefix}--processing`

	const fieldIdPrefix = fieldId => {
		return `${formIdPrefix}-${fieldId}`
	}

	const addClasses = (attrs, classes) => {
		if (classes.length) {
			attrs.className = classes.join(" ")
		}
		return attrs
	}

	const getInputName = (field, isSubField) => {
		if (field.inputName) {
			return field.inputName
		} else if (field.name) {
			return field.name
		}
		if (isSubField) {
			return "input_" + field.id
		}
		return "input_" + field.id
	}

	const getDescriptionPlacement = field => {
		if (!field.descriptionPlacement) {
			return "below" === formData.descriptionPlacement ? "below" : "above"
		}
		return "below" === field.descriptionPlacement ? "below" : "above"
	}

	const showFieldLabel = (field, isSubField) => {
		if (true === isSubField) {
			return true
		}
		if (!field.labelPlacement) {
			return "hidden_label" === formData.labelPlacement ? false : true
		}
		return "hidden_label" === field.labelPlacement ? false : true
	}

	const getLabelPlacement = (field, isSubField) => {
		if (true === isSubField) {
			if (!field.subLabelPlacement) {
				return "below" === formData.subLabelPlacement ? "below" : "above"
			}
			return "below" === field.subLabelPlacement ? "below" : "above"
		}
		if (!field.labelPlacement) {
			return "below_label" === formData.labelPlacement ? "below" : "above"
		}
		return "below_label" === field.labelPlacement ? "below" : "above"
	}

	const getFieldRequiredMessage = () => {
		return <span className="gform__field__required">* <span className="for-screen-reader"> Required</span></span>
	}

	const FormFieldset = ({ field, children }) => {
		const fieldId = fieldIdPrefix(field.id)

		let fieldsetAttr = {
			id: `${fieldId}-fieldset`,
			className: `${formPrefix}__fieldset ${formPrefix}__fieldset--${field.type}`,
		}

		let legendAttr = {
			id: `${fieldId}-legend`,
			className: `${formPrefix}__legend ${formPrefix}__legend--${field.type}`,
		}

		let fieldDesc = <FormFieldDescription field={field} />
		const descPlacement = getDescriptionPlacement(field)

		const legendLabel = <span>{field.label}</span>

		let legendRequired
		if (field.isRequired) {
			legendAttr.className += ` ${formPrefix}__legend--required`
			legendRequired = getFieldRequiredMessage()
		}

		return (
			<fieldset {...fieldsetAttr}>
				<legend {...legendAttr}>{legendLabel}{legendRequired}</legend>
				{"above" === descPlacement ? fieldDesc : ""}
				{children}
				{"below" === descPlacement ? fieldDesc : ""}
				<FormFieldError field={field} isFieldset={true} />
			</fieldset>
		)
	}

	FormFieldset.propTypes = {
		field: PropTypes.object.isRequired,
		children: PropTypes.node.isRequired,
	}

	const FormFieldDescription = ({ field }) => {
		if (!field.description) {
			return null
		}
		let descAttr = {
			id: `${fieldIdPrefix(field.id)}-description`,
			className: `${formPrefix}__description ${formPrefix}__description--${field.type}`,
		}
		return <div {...descAttr}>{field.description}</div>
	}

	FormFieldDescription.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldContainer = ({ field, index, children }) => {

		let fieldID = field.id

		if (undefined !== index) {
			fieldID += "." + index
		}

		const containerAttr = {
			id: `${fieldIdPrefix(fieldID)}-container`,
			className: `${formPrefix}__container ${formPrefix}__container--${field.type}`,
		}
		return <div {...containerAttr}>{children}</div>
	}

	FormFieldContainer.propTypes = {
		field: PropTypes.object.isRequired,
		index: PropTypes.number,
		children: PropTypes.node.isRequired,
	}

	const FormFieldOptions = ({ field, options, hideDescription }) => {
		const optionsAttr = {
			id: `${fieldIdPrefix(field.id)}-options`,
			className: `${formPrefix}__options ${formPrefix}__options--${field.type}`,
		}
		return (
			<div {...optionsAttr}>
				{options.map((input, i) => {

					// If input has an ID, then any indexing issues are resolved when we merge.
					const inputHasID = undefined !== input.id

					let thisField = {
						...field,
						...input,
					}

					if (inputHasID) {

						const isSubField = ["email", "name"].includes(field.type)

						return <FormFieldInput
							key={i}
							field={thisField}
							isSubField={isSubField}
							hideDescription={hideDescription}
						/>
					}

					return <FormFieldInput
						key={i}
						field={thisField}
						isSubField={true}
						index={i}
						hideDescription={hideDescription}
					/>
				})}
			</div>
		)
	}

	FormFieldOptions.propTypes = {
		field: PropTypes.object.isRequired,
		options: PropTypes.array.isRequired,
		hideDescription: PropTypes.bool
	}

	FormFieldOptions.defaultProps = {
		hideDescription: false
	}

	const getElementID = (field, index) => {
		let fieldID = field.id
		if (undefined !== index) {
			fieldID += "." + index
		}
		return `${fieldIdPrefix(fieldID)}-element`
	}

	const getLabelID = (field, index) => {
		let fieldID = field.id
		if (undefined !== index) {
			fieldID += "." + index
		}
		return `${fieldIdPrefix(fieldID)}-label`
	}

	const getFieldLabel = (field, isChoice) => {
		if ("radio" === field.type && isChoice) {
			return field.text
		}
		if (field.customLabel) {
			return field.customLabel
		}
		return field.label
	}

	const getFieldErrorID = (field, index) => {
		let fieldID = field.id
		if (undefined !== index) {
			fieldID += "." + index
		}
		return `${fieldIdPrefix(fieldID)}-error`
	}

	const onRadioChange = event => {
		//console.log("onRadioChange")
		//console.log(event)
	}

	const getElementAttr = (field, index) => {

		const isSubField = undefined !== index

		let inputType
		switch (field.type) {
			case "name":
				inputType = "text"
				break
			case field.type:
				inputType = field.type
				break
			default:
				inputType = "text"
				break
		}

		let inputName
		if (isSubField) {
			inputName = getInputName(field, isSubField)
		} else {
			inputName = field.inputName
				? field.inputName
				: getInputName(field, isSubField)
		}

		let elementAttr = {
			id: getElementID(field, index),
			name: inputName,
			type: inputType,
			className: `${formPrefix}__element ${formPrefix}__element--${inputType}`,
			"aria-labelledby": `${getLabelID(field, index)} ${getFieldErrorID(field, index)}`,
		}

		if (field.placeholder) {
			elementAttr.placeholder = field.placeholder
		}

		if ("radio" === field.type) {
			elementAttr.defaultValue = field.value
			elementAttr.onChange = onRadioChange
			if (field.isSelected) {
				elementAttr.checked = "checked"
			}
		} else if (field.value) {
			elementAttr.defaultValue = field.value
		} else if (field.defaultValue) {
			elementAttr.defaultValue = field.defaultValue
		}

		if (field.isRequired) {
			elementAttr["aria-required"] = "true"
		}

		if (field.isInvalid) {
			elementAttr["aria-invalid"] = "true"
		}

		return elementAttr
	}

	const logFormError = (field, error) => {
		formErrors.push({
			field: field,
			error: error
		})
	}

	const FormFieldLabel = ({ field, placement, index, isSubField }) => {
		if (!showFieldLabel(field, isSubField)) {
			return null
		}

		const fieldLabel = getFieldLabel(field, isSubField)
		const cssLabel = `${formPrefix}__label`
		let className = `${cssLabel} ${cssLabel}--${field.type}`

		if (placement) {
			className += ` ${cssLabel}--${placement}`
		}

		const labelAttr = {
			htmlFor: getElementID(field, index),
			id: getLabelID(field, index),
			className: className
		}

		let labelRequired
		if (field.isRequired && !isSubField) {
			labelAttr.className += ` ${formPrefix}__label--required`
			labelRequired = getFieldRequiredMessage()
		}

		return <label {...labelAttr}>{fieldLabel}{labelRequired}</label>
	}

	FormFieldLabel.propTypes = {
		field: PropTypes.object.isRequired,
		placement: PropTypes.string,
		index: PropTypes.number,
		isSubField: PropTypes.bool
	}

	FormFieldLabel.defaultProps = {
		placement: "",
		isSubField: false
	}

	const FormFieldInput = ({ field, isSubField, index, hideDescription }) => {
		if (true === field.isHidden) {
			return null
		}

		const inputAttr = getElementAttr(field, index)
		const labelPlacement = getLabelPlacement(field, isSubField)

		const fieldLabel = <FormFieldLabel field={field} index={index} isSubField={isSubField} placement={labelPlacement} />

		let descPlacement, fieldDesc
		if (!isSubField && !hideDescription) {
			descPlacement = getDescriptionPlacement(field)
			fieldDesc = <FormFieldDescription field={field} />
		}

		return (
			<FormFieldContainer field={field} index={index}>
				{"above" === labelPlacement ? fieldLabel : ""}
				{fieldDesc && "above" === descPlacement ? fieldDesc : ""}
				<input {...inputAttr} />
				{"below" === labelPlacement ? fieldLabel : ""}
				{fieldDesc && "below" === descPlacement ? fieldDesc : ""}
				<FormFieldError field={field} index={index} />
			</FormFieldContainer>
		)
	}

	FormFieldInput.propTypes = {
		field: PropTypes.object.isRequired,
		isSubField: PropTypes.bool,
		index: PropTypes.number,
		hideDescription: PropTypes.bool
	}

	FormFieldInput.defaultProps = {
		isSubField: false,
		hideDescription: false
	}

	const FormFieldEmail = ({ field }) => {
		return (
			<FormFieldset field={field}>
				<FormFieldOptions
					field={field}
					options={field.inputs}
					hideDescription={true}
				/>
			</FormFieldset>
		)
	}

	FormFieldEmail.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldName = ({ field }) => {
		return (
			<FormFieldset field={field}>
				<FormFieldOptions
					field={field}
					options={field.inputs}
				/>
			</FormFieldset>
		)
	}

	FormFieldName.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldRadio = ({ field }) => {
		let choices = field.choices
		if ("string" === typeof choices) {
			choices = JSON.parse(choices)
		}
		return (
			<FormFieldset field={field}>
				<FormFieldOptions field={field} options={choices} />
			</FormFieldset>
		)
	}

	FormFieldRadio.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldSection = ({ field }) => {
		if (!field.label) {
			return null
		}

		const fieldId = fieldIdPrefix(field.id)

		let sectionAttr = {
			id: `${fieldId}-section`,
			className: `${formPrefix}__section ${formPrefix}__section--${field.type}`,
		}

		let headingAttr = {
			id: `${fieldId}-heading`,
			className: `${formPrefix}__heading ${formPrefix}__heading--${field.type}`,
		}
		let fieldDesc = <FormFieldDescription field={field} />

		return (
			<div {...sectionAttr}>
				<h2 {...headingAttr}>{field.label}</h2>
				{fieldDesc}
			</div>
		)
	}

	FormFieldSection.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldTextarea = ({ field }) => {
		const textAreaAttr = getElementAttr(field)

		let fieldDesc = <FormFieldDescription field={field} />
		const descPlacement = getDescriptionPlacement(field)

		const labelPlacement = getLabelPlacement(field)

		const fieldLabel = <FormFieldLabel field={field} placement={labelPlacement} />

		return (
			<FormFieldContainer field={field}>
				{"above" === labelPlacement ? fieldLabel : ""}
				{"above" === descPlacement ? fieldDesc : ""}
				<textarea {...textAreaAttr} />
				{"below" === labelPlacement ? fieldLabel : ""}
				{"below" === descPlacement ? fieldDesc : ""}
				<FormFieldError field={field} />
			</FormFieldContainer>
		)
	}

	FormFieldTextarea.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormField = ({ field }) => {
		let fieldAttr = {
			id: `${fieldIdPrefix(field.id)}-field`,
		}

		const fieldPrefix = `${formPrefix}__field`

		const fieldClass = [fieldPrefix, `${fieldPrefix}--${field.type}`]

		if (field.cssClass) {
			fieldClass.push(field.cssClass)
		}

		if (field.isInvalid) {
			fieldClass.push(`${fieldPrefix}--error`)
		}

		// Add classes to attributes.
		fieldAttr = addClasses(fieldAttr, fieldClass)

		let fieldMarkup

		switch (field.type) {
			case "section":
				fieldMarkup = <FormFieldSection field={field} />
				break
			case "name":
				fieldMarkup = <FormFieldName field={field} />
				break
			case "email":
				fieldMarkup = <FormFieldEmail field={field} />
				break
			case "text":
			case "password":
				if (field.enablePasswordInput) {
					field.type = "password"
				}
				fieldMarkup = <FormFieldInput field={field} />
				break
			/*case "hidden":
				fieldMarkup = <FormFieldInput field={field} />
				break*/
			case "radio":
				fieldMarkup = <FormFieldRadio field={field} />
				break
			case "textarea":
				fieldMarkup = <FormFieldTextarea field={field} />
				break
			default:
				fieldMarkup = null
				break
		}

		if (!fieldMarkup) {
			return null
		}

		return <div {...fieldAttr}>{fieldMarkup}</div>
	}

	FormField.propTypes = {
		field: PropTypes.object.isRequired,
	}

	// @TODO possible CSS: top_label form_sublabel_below description_below
	const processFormFields = () => {
		let fieldsAttr = {
			id: `${formIdPrefix}-fields`,
			className: `${formPrefix}__fields`,
		}
		return (
			<div {...fieldsAttr}>
				{formFields.map((field, i) => {
					// Setup input names.
					field.inputName = getInputName(field)
					if (field.inputs) {
						for (let j = 0; j < field.inputs.length; j++) {
							field.inputs[j].inputName = getInputName(field.inputs[j], true)
						}
					}
					return <FormField key={i} field={field} />
				})}
			</div>
		)
	}

	const FormFieldError = ({ field, index, isFieldset }) => {

		const errorAttr = {
			id: getFieldErrorID(field, index),
			className: `${formPrefix}__error ${formPrefix}__error--${field.type}`,
			role: "alert",
			"aria-live": "polite"
		}

		if (isFieldset) {
			errorAttr.id += "-fieldset"
		}

		const errorMessage = isFieldset ? field.fieldsetErrorMessage : field.errorMessage

		if (!errorMessage) {
			errorAttr.className += " for-screen-reader"
		}

		return (
			<div {...errorAttr}>
				{errorMessage ? <p>{errorMessage}</p> : null}
			</div>
		)
	}

	FormFieldError.propTypes = {
		field: PropTypes.object.isRequired,
		index: PropTypes.number,
		isFieldset: PropTypes.bool,
	}

	FormFieldError.defaultProps = {
		isFieldset: false
	}

	const FormErrors = () => {
		const errorsPrefix = `${formPrefix}__errors`
		const errorsAttr = {
			id: `${formIdPrefix}-errors`,
			className: errorsPrefix,
			role: "alert",
			"aria-live": "assertive",
		}
		let errorsMessage = "",
			errorsList = ""
		if (formErrors.length) {

			let errorMessage = ""
			if (1 === formErrors.length) {
				errorMessage = "There was 1 error found in the information you submitted."
			} else {
				errorMessage = `There were ${formErrors.length} errors found in the information you submitted.`
			}

			errorsMessage = (
				<p className={`${errorsPrefix}__message`}>{errorMessage}</p>
			)

			errorsList = (
				<ol className={`${errorsPrefix}__list`}>
					{formErrors.map((error, i) => {
						const elementID = getElementID(error.field)
						const elementLabel = getFieldLabel(error.field)
						return (
							<li key={i}>
								<a href={`#${elementID}`}>{elementLabel} - {error.error}</a>
							</li>
						)
					})}
				</ol>
			)
		} else {
			errorsAttr.className += " for-screen-reader"
		}
		return (
			<div {...errorsAttr}>
				{errorsMessage}
				{errorsList}
			</div>
		)
	}

	const FormFooter = () => {
		const footerAttr = {
			className: `${formPrefix}__footer`, // @TODO top_label
		}
		const submitAttr = {
			type: "submit",
			id: `${formIdPrefix}-submit`,
			className: `${formPrefix}__submit wpc-button wpc-button--primary`, // @TODO top_label
			value: formData.button.text,
		}
		return (
			<div {...footerAttr}>
				<input {...submitAttr} />
			</div>
		)
	}

	const submitEntry = entry => {
		return new Promise((resolve, reject) => {

			let url = `${entriesAPI}?form_id=${formId}`

			const options = {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(entry)
			}

			/*
			 * On DEV, we send an authorization key.
			 * On PROD, we validate via CORS.
			 */
			if (isDev && token != "") {

				const keyEncode = window.btoa(
					process.env.WPC_GF_API_KEY + ":" + process.env.WPC_GF_API_SECRET
				)

				// Add Gravity Forms API key.
				options.headers["Authorization"] = `Basic ${keyEncode}`

				// Add JWT token.
				options.headers["Authorization"] = `Bearer ${token}`

			}

			return fetch(url, options)
				.then((response) => {
					resolve(response)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const validateFormElement = (form, field) => {
		return new Promise((resolve) => {

			let element = field.inputName ? form.elements[field.inputName] : null

			let isInvalid = false
			let errorMessage = ""
			let elementValue = element && element.value ? element.value : null

			if (field.isRequired && !element.value) {
				isInvalid = true
				errorMessage = "This field is required."
			}

			resolve({
				isInvalid: isInvalid,
				errorMessage: errorMessage,
				entryValue: elementValue
			})
		})
	}

	const validateFormFieldName = async (form, field) => {

		if (field.inputs && field.inputs.length) {
			for (let i = 0; i < field.inputs.length; i++) {

				let input = field.inputs[i]

				if (input.isHidden) {
					continue
				}

				input = {
					...field,
					...input,
				}

				await validateFormElement(form, input).then(function ({ isInvalid, errorMessage, entryValue }) {

					field.inputs[i].value = entryValue

					// Let us know if the field data is invalid.
					if (isInvalid) {
						field.inputs[i].isInvalid = true
						field.inputs[i].errorMessage = errorMessage
						field.isInvalid = true
						logFormError(input, errorMessage)
					} else {

						field.inputs[i].isInvalid = false
						field.inputs[i].errorMessage = ""
						field.isInvalid = false

						// Add to entry.
						if (entryValue) {
							formEntry[input.id] = entryValue
						}
					}
				})
			}
		}

		return {
			field: field
		}
	}

	const validateFormFieldEmail = async (form, field) => {

		let emailValue = ""
		let emailIsInvalid = 0

		// @TODO need to test for when we don't want both emails.
		if (field.inputs && field.inputs.length) {
			for (let i = 0; i < field.inputs.length; i++) {

				let input = field.inputs[i]

				if (input.isHidden) {
					continue
				}

				input = {
					...field,
					...input,
				}

				await validateFormElement(form, input).then(function ({ isInvalid, errorMessage, entryValue }) {

					field.inputs[i].value = entryValue

					if (isInvalid) {
						emailIsInvalid++
						field.inputs[i].isInvalid = true
					} else {
						field.inputs[i].isInvalid = false
					}

					if (entryValue) {

						if (emailValue && emailValue !== entryValue) {
							emailIsInvalid++
						} else {
							emailValue = entryValue
						}
					}
				})
			}

			if (emailIsInvalid) {

				field.isInvalid = true

				if (emailValue) {
					field.fieldsetErrorMessage = "Please enter a valid email address."
					logFormError(field, field.fieldsetErrorMessage)
				} else {
					field.fieldsetErrorMessage = "This field is required."
					logFormError(field, field.fieldsetErrorMessage)
				}

				// Make sure emails are marked invalid.
				for (let i = 0; i < field.inputs.length; i++) {
					field.inputs[i].isInvalid = true
				}
			} else {

				field.isInvalid = false
				field.fieldsetErrorMessage = ""

				// Add to entry.
				if (emailValue) {
					formEntry[field.id] = emailValue
				}
			}
		}

		return {
			field: field
		}
	}

	const validateFormFieldRadio = async (form, field) => {

		if ("string" === typeof field.choices) {
			field.choices = JSON.parse(field.choices)
		}

		let radioElements = field.inputName ? form.elements[field.inputName] : null

		let elementValue = null

		for (let i = 0; i < radioElements.length; i++) {

			let radio = radioElements[i]

			if (radio.checked) {
				elementValue = radio.value
				break
			}
		}

		// Let us know if the field data is invalid.
		if (!elementValue) {

			if (field.isRequired) {
				field.isInvalid = true
				field.fieldsetErrorMessage = "This field is required."
				logFormError(field, field.fieldsetErrorMessage)
			}
		} else {

			field.isInvalid = false
			field.fieldsetErrorMessage = ""

			// Add to entry.
			formEntry[field.id] = elementValue

			// Mark selected in choices.
			for (let i = 0; i < field.choices.length; i++) {
				if (field.choices[i].value === elementValue) {
					field.choices[i].isSelected = true
					break
				}
			}
		}

		return {
			field: field
		}
	}

	const validateFormFieldTextarea = async (form, field) => {

		await validateFormElement(form, field).then(function ({ isInvalid, errorMessage, entryValue }) {

			field.value = entryValue

			if (isInvalid) {
				field.isInvalid = true
				logFormError(field, errorMessage)
			} else {
				field.isInvalid = false
			}

			field.errorMessage = errorMessage

			// Add to entry.
			if (entryValue) {
				formEntry[field.id] = entryValue
			}
		})

		return {
			field: field
		}
	}

	const validateFormField = async (form, field) => {

		// @TODO use for reject() for invalid fields
		//let invalidFormMessage = "Invalid form"

		switch (field.type) {

			case "name":
				return await validateFormFieldName(form, field)

			case "email":
				return await validateFormFieldEmail(form, field)

			case "radio":
				return await validateFormFieldRadio(form, field)

			case "textarea":
				return await validateFormFieldTextarea(form, field)

		}

		return {
			field: field,
		}
	}

	/**
	 * Validates all of the form fields
	 * and stores values in the form entry.
	 */
	const validateFormFields = async (form) => {

		for (let i = 0; i < formFields.length; i++) {

			/*
			 * Validates each form field and,
			 * if valid, adds value to the entry.
			 */
			await validateFormField(form, formFields[i])
				.then(({ field }) => {

					// Put field back into the state.
					formFields[i] = field

				})
		}

		// This means 1 or more fields were invalid.
		if (formErrors.length) {
			// @TODO optimize error message?
			throw "The form has errors."
		}

		return true
	}

	/*
	 * Validates all of the form fields and,
	 * if successful, builds the submission entry.
	 */
	const validateForm = async (form) => {
		// On success, returns the form's submission entry.
		return await validateFormFields(form)
	}

	const handleFormSubmit = event => {
		event.preventDefault()

		const form = event.target

		// @TODO how to handle this error?
		// Add to form errors so displayed?
		if (!form) {
			return false
		}

		// Reset the entry and errors.
		formEntry = {}
		formErrors = []

		// Let us know we're processing.
		form.classList.add(formProcessingCSS)

		validateForm(form)
			.then(function () {

				// Add form ID to entry.
				formEntry.form_id = formId

				console.log("entry success")
				console.log(formEntry)

				submitEntry(formEntry)
					.then(response => response.json())
					.then(function (response) {
						console.log("response")
						console.log(response)
					})
					.catch(function (error) {
						console.error(error) // @TODO how to handle error?
					})
			})
			.catch(error => {
				// @TODO how to handle the error?
				console.error(error)
			})
			.finally(() => {

				// Put the fields back into the state.
				formData = {
					...formData,
					formFields: formFields,
				}

				setState({
					...state,
					processing: false,
					formData: formData,
					formErrors: formErrors
				})

				form.classList.remove(formProcessingCSS)
			})

		return false
	}

	// Start building form information.
	let formAttr = {
		action: "",
		method: "post",
		id: formIdPrefix,
		name: formName,
	}

	const formClass = [formPrefix]

	if (formData.cssClass) {
		formClass.push(formData.cssClass)
	}

	if (true === state.processing) {
		formClass.push(formProcessingCSS)
	}

	// Add classes to attributes.
	formAttr = addClasses(formAttr, formClass)

	useEffect(() => {
		const firstInvalid = document.querySelector("input[aria-invalid=true]")
		if (firstInvalid) {
			firstInvalid.focus()
		}
	}, state)

	return (
		<form {...formAttr} onSubmit={handleFormSubmit}>
			<FormErrors />
			{processFormFields()}
			<FormFooter />
		</form>
	)
}

Form.propTypes = {
	data: PropTypes.object.isRequired,
	token: PropTypes.string
}

export default Form
