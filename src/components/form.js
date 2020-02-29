import React from "react"
import PropTypes from "prop-types"

/*
 * @TODO:
 * - Add action
 */
const Form = ({ data }) => {
	if (!data.formId) {
		return null
	}
	if (!data.is_active || "1" === data.is_trash) {
		return null
	}

	const formId = data.formId
	const formName = `gForm${formId}`
	const formFields = data.formFields

	const formPrefix = "gform"
	const formIdPrefix = `${formPrefix}-${formId}`
	const fieldPrefix = `${formPrefix}__field`

	const fieldTypePrefix = type => {
		return `${fieldPrefix}--${type}`
	}

	const fieldIdPrefix = fieldId => {
		return `${formIdPrefix}-${fieldId}`
	}

	const addClasses = (attrs, classes) => {
		if (classes.length) {
			attrs.className = classes.join(" ")
		}
		return attrs
	}

	const getInputName = field => {
		if (field.inputName) {
			return field.inputName
		} else if (field.name) {
			return field.name
		}
		return "input_" + field.id
	}

	const getDescriptionPlacement = field => {
		if (!field.descriptionPlacement) {
			return "below" === data.descriptionPlacement ? "below" : "above"
		}
		return "below" === field.descriptionPlacement ? "below" : "above"
	}

	const showFieldLabel = (field, isSubField) => {
		if (true === isSubField) {
			return true
		}
		if (!field.labelPlacement) {
			return "hidden_label" === data.labelPlacement ? false : true
		}
		return "hidden_label" === field.labelPlacement ? false : true
	}

	const getLabelPlacement = (field, isSubField) => {
		if (true === isSubField) {
			if (!field.subLabelPlacement) {
				return "below" === data.subLabelPlacement ? "below" : "above"
			}
			return "below" === field.subLabelPlacement ? "below" : "above"
		}
		if (!field.labelPlacement) {
			return "below_label" === data.labelPlacement ? "below" : "above"
		}
		return "below_label" === field.labelPlacement ? "below" : "above"
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

		// @TODO need aria-required="true"?

		// @TODO need? <span className="gfield_required">* <span className="sr-only"> Required</span></span>

		let fieldDesc = <FormFieldDescription field={field} />
		const descPlacement = getDescriptionPlacement(field)

		return (
			<fieldset {...fieldsetAttr}>
				<legend {...legendAttr}>{field.label}</legend>
				{"above" === descPlacement ? fieldDesc : ""}
				{children}
				{"below" === descPlacement ? fieldDesc : ""}
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

	const FormFieldContainer = ({ field, children }) => {
		const containerAttr = {
			id: `${fieldIdPrefix(field.id)}-container`,
			className: `${formPrefix}__container ${formPrefix}__container--${field.type}`,
		}
		return <div {...containerAttr}>{children}</div>
	}

	FormFieldContainer.propTypes = {
		field: PropTypes.object.isRequired,
		children: PropTypes.node.isRequired,
	}

	// @TODO possible container classes: ginput_complex ginput_container no_prefix has_first_name no_middle_name has_last_name no_suffix gf_name_has_2 ginput_container_name
	const FormFieldOptions = ({ field, options }) => {
		const optionsAttr = {
			id: `${fieldIdPrefix(field.id)}-options`,
			className: `${formPrefix}__options ${formPrefix}__options--${field.type}`,
		}
		return (
			<div {...optionsAttr}>
				{options.map((input, i) => {
					field = {
						...field,
						...input,
					}
					return <FormFieldInput key={i} field={field} index={i} />
				})}
			</div>
		)
	}

	FormFieldOptions.propTypes = {
		field: PropTypes.object.isRequired,
		options: PropTypes.array.isRequired,
	}

	const getFieldID = field => {
		return `${fieldIdPrefix(field.id)}-field`
	}

	const getFieldAttr = field => {
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

		let fieldAttr = {
			id: getFieldID(field),
			name: getInputName(field),
			type: inputType,
			className: `${formPrefix}__field ${formPrefix}__field--${inputType}`,
		}

		if (field.placeholder) {
			fieldAttr.placeholder = field.placeholder
		}

		if (field.defaultValue) {
			fieldAttr.defaultValue = field.defaultValue
		}

		if (field.isRequired) {
			fieldAttr["aria-required"] = "true"
		}

		return fieldAttr
	}

	const FormFieldLabel = ({ field, isSubField }) => {
		if (!showFieldLabel(field, isSubField)) {
			return null
		}
		let fieldLabel = ""
		if ("radio" === field.type) {
			fieldLabel = field.value
		} else if (field.customLabel) {
			fieldLabel = field.customLabel
		} else {
			fieldLabel = field.label
		}
		const labelAttr = {
			htmlFor: getFieldID(field),
			className: `${formPrefix}__label ${formPrefix}__label--${field.type}`,
		}
		return <label {...labelAttr}>{fieldLabel}</label>
	}

	FormFieldLabel.defaultProps = {
		isSubField: false,
	}

	FormFieldLabel.propTypes = {
		field: PropTypes.object.isRequired,
		isSubField: PropTypes.bool,
	}

	// @TODO add type CSS somewhere
	const FormFieldInput = ({ field, index }) => {
		if (true === field.isHidden) {
			return null
		}

		const isSubField = undefined !== index

		const inputAttr = getFieldAttr(field)

		const fieldLabel = <FormFieldLabel field={field} isSubField={isSubField} />
		const labelPlacement = getLabelPlacement(field, isSubField)

		let descPlacement, fieldDesc
		if (!isSubField) {
			descPlacement = getDescriptionPlacement(field)
			fieldDesc = <FormFieldDescription field={field} />
		}

		return (
			<FormFieldContainer field={field}>
				{"above" === labelPlacement ? fieldLabel : ""}
				{fieldDesc && "above" === descPlacement ? fieldDesc : ""}
				<input {...inputAttr} />
				{"below" === labelPlacement ? fieldLabel : ""}
				{fieldDesc && "below" === descPlacement ? fieldDesc : ""}
			</FormFieldContainer>
		)
	}

	FormFieldInput.propTypes = {
		field: PropTypes.object.isRequired,
		index: PropTypes.number,
	}

	// @TODO possible container CSS ginput_complex ginput_container ginput_container_email
	const FormFieldEmail = ({ field }) => {
		return (
			<FormFieldset field={field}>
				<FormFieldOptions field={field} options={field.inputs} />
			</FormFieldset>
		)
	}

	FormFieldEmail.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldName = ({ field }) => {
		return (
			<FormFieldset field={field}>
				<FormFieldOptions field={field} options={field.inputs} />
			</FormFieldset>
		)
	}

	FormFieldName.propTypes = {
		field: PropTypes.object.isRequired,
	}

	const FormFieldRadio = ({ field }) => {
		let choices = JSON.parse(field.choices)
		return (
			<FormFieldset field={field}>
				<FormFieldOptions field={field} options={choices} />
			</FormFieldset>
		)
	}

	FormFieldRadio.propTypes = {
		field: PropTypes.object.isRequired,
	}

	/*const FormFieldSection = ({ field }) => {
    if (!field.label) {
      return null
    }

    let cssFieldType = fieldTypePrefix(field.type)

    let fieldAttr = {
      id: fieldIdPrefix(field.id),
      className: `${fieldPrefix} ${cssFieldType}`,
    }

    const sectionAttr = {
      className: `${cssFieldType}__title`,
    }

    return (
      <div {...fieldAttr}>
        <h2 {...sectionAttr}>{field.label}</h2>
        {field.description && !field.descriptionPlacement ? (
          <div className={`${cssFieldType}__description`}>
            {field.description}
          </div>
        ) : null}
      </div>
    )
  }

  FormFieldSection.propTypes = {
    field: PropTypes.object.isRequired,
  }*/

	const FormFieldTextarea = ({ field }) => {
		// @TODO add?
		/*<span className="gfield_required">
      {" "} * <span className="sr-only"> Required</span>
    </span>*/
		const textAreaAttr = getFieldAttr(field)

		let fieldDesc = <FormFieldDescription field={field} />
		const descPlacement = getDescriptionPlacement(field)

		return (
			<div>
				<FormFieldContainer field={field}>
					<FormFieldLabel field={field} />
					{"above" === descPlacement ? fieldDesc : ""}
					<textarea {...textAreaAttr} />
					{"below" === descPlacement ? fieldDesc : ""}
				</FormFieldContainer>
			</div>
		)
	}

	FormFieldTextarea.propTypes = {
		field: PropTypes.object.isRequired,
	}

	/*
   * @TODO possible CSS:
   * field_sublabel_below
   * field_description_below
   * gfield_visibility_visible
   * gfield_contains_required
   */
	const FormField = ({ field }) => {
		let fieldAttrs = {
			id: fieldIdPrefix(field.id),
		}

		const fieldClass = [fieldPrefix, fieldTypePrefix(field.type)]

		if (field.cssClass) {
			fieldClass.push(field.cssClass)
		}

		// Add classes to attributes.
		fieldAttrs = addClasses(fieldAttrs, fieldClass)

		let fieldMarkup

		switch (field.type) {
		/*case "section":
        fieldMarkup = <FormFieldSection field={field} />
        break*/
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

		return <div {...fieldAttrs}>{fieldMarkup}</div>
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
				{formFields.map((field, i) => (
					<FormField key={i} field={field} />
				))}
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
			className: `${formPrefix}__submit`, // @TODO top_label
			value: data.button.text,
		}
		return (
			<div {...footerAttr}>
				<input {...submitAttr} />
			</div>
		)
	}

	const submitData = data => {
		let keyEncode = window.btoa(
			process.env.WPC_GF_API_KEY + ":" + process.env.WPC_GF_API_SECRET
		)
		// @TODO COOOOOOOOOOOOOOOOOOOORS
		return new Promise((resolve, reject) => {
			let url = `https://${process.env.WPC_HOST}/wp-json/gf/v2/entries?form_id=${formId}`
			const request = new XMLHttpRequest()
			request.open("POST", url)
			request.responseType = "application/json"
			request.setRequestHeader("Content-Type", "application/json")
			request.setRequestHeader("Authorization", "Basic " + keyEncode)
			request.onload = () => resolve(request)
			request.onerror = () => reject(request)
			request.send(JSON.stringify(data))
		})
	}

	const validateFormData = () => {
		var form = document.forms[formName]
		let formData = {
			form_id: formId,
		}
		let formValid = true

		console.log(form)

		/*{
      formFields.map((field, i) => {
        let inputName = getInputName(field)
        let element = form.elements[inputName]

        if (element.length) {
          for (let i = 0; i < element.length; i++) {
            console.log("checked: " + element[i].checked)
          }
        } else if (element) {
          formData[field.id] = element.value
        }
        console.log(element)
        console.log(field)
      })
    }*/

		if (!formValid) {
			return false
		}

		console.log(formData)

		return false
		//return formData
		/*return {
      "1.3": "Sally",
      "1.6": "Fields",
      "2": "sally@fields.com",
      "4": "A WPCampus conference",
      "3": "I like shiny things.",
    }*/
	}

	const handleFormSubmit = event => {
		event.preventDefault()

		let data = validateFormData()

		// @TODO handle error? validateData() should do this
		if (false === data) {
			return false
		}

		submitData(data)
			.then(function(response) {
				console.log("response")
				console.log(response)
			})
			.catch(function(error) {
				console.error(error)
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

	if (data.cssClass) {
		formClass.push(data.cssClass)
	}

	// Add classes to attributes.
	formAttr = addClasses(formAttr, formClass)

	return (
		<form {...formAttr} onSubmit={handleFormSubmit}>
			{processFormFields()}
			<FormFooter />
		</form>
	)
}

Form.propTypes = {
	data: PropTypes.object.isRequired,
}

export default Form
