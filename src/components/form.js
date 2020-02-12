import React from "react"
import PropTypes from "prop-types"

import "./../css/form.css"

const cssFormPrefix = "wpc-gform"
const cssFieldPrefix = `${cssFormPrefix}__field`

const cssFieldTypePrefix = type => {
  return `${cssFieldPrefix}--${type}`
}

const cssFieldIdPrefix = (formId, fieldId) => {
  return `${cssFieldPrefix}-${formId}-${fieldId}`
}

const addClasses = (attrs, classes) => {
  if (classes.length) {
    attrs.className = classes.join(" ")
  }
  return attrs
}

const Fieldset = ({ formId, field, children }) => {
  let fieldsetAttr = {
    id: `${cssFieldIdPrefix(formId, field.id)}__fieldset`,
    className: `${cssFormPrefix}__fieldset`,
  }

  // @TODO need aria-required="true"?

  // @TODO need? <span class="gfield_required">* <span class="sr-only"> Required</span></span>

  return (
    <fieldset {...fieldsetAttr}>
      <legend className="gfield_label">{field.label}</legend>
      {children}
    </fieldset>
  )
}

Fieldset.propTypes = {
  formId: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

const FormInput = field => {
  console.log("input")
  console.log(field)
  let inputAttr = {
    //id: `${cssFieldIdPrefix(formId, field.id)}__input`,
    name: field.inputName,
    type: "hidden",
    //className: `${cssFieldTypePrefix(field.type)}__input`,
    value: "",
  }
  return <input {...inputAttr} />
}

// @TODO add value, double check CSS
const FormFieldHidden = ({ formId, field }) => {
  let inputAttr = {
    id: `${cssFieldIdPrefix(formId, field.id)}__input`,
    name: field.inputName,
    type: "hidden",
    //className: `${cssFieldTypePrefix(field.type)}__input`,
    value: "",
  }
  return <input {...inputAttr} />
}

const FormFieldEmail = ({ formId, field }) => {}

const FormFieldName = ({ formId, field }) => {
  console.log("name")
  console.log(field)

  return (
    <Fieldset formId={formId} field={field}>
      <div
        id="input_3_1"
        className="ginput_complex ginput_container no_prefix has_first_name no_middle_name has_last_name no_suffix gf_name_has_2 ginput_container_name"
      >
        <span id="input_3_1_3_container" className="name_first">
          <input
            type="text"
            name="input_1.3"
            id="input_3_1_3"
            value="Rachel"
            aria-label="First name"
            aria-required="true"
            aria-invalid="false"
          />
          <label htmlFor="input_3_1_3">First</label>
        </span>
        <span id="input_3_1_6_container" className="name_last">
          <input
            type="text"
            name="input_1.6"
            id="input_3_1_6"
            value="Cherry"
            aria-label="Last name"
            aria-required="true"
            aria-invalid="false"
          />
          <label htmlFor="input_3_1_6">Last</label>
        </span>
      </div>
    </Fieldset>
  )
  /*let inputAttr = {
    id: `${cssFieldIdPrefix(formId, field.id)}__input`,
    name: field.inputName,
    type: "hidden",
    className: `${cssFieldTypePrefix(field.type)}__input`,
    value: "",
  }
  return <input {...inputAttr} />*/
}

const FormFieldSection = ({ formId, field }) => {
  if (!field.label) {
    return null
  }

  let cssFieldType = cssFieldTypePrefix(field.type)

  let fieldAttr = {
    id: cssFieldIdPrefix(formId, field.id),
    className: `${cssFieldPrefix} ${cssFieldType}`,
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

const FormFieldTextarea = ({ formId, field }) => {
  return (
    <div>
      <label className="gfield_label" for="input_3_3">
        Your Message
        <span className="gfield_required">
          {" "}
          * <span className="sr-only"> Required</span>
        </span>
      </label>
      <div className="ginput_container ginput_container_textarea">
        <textarea
          name="input_3"
          id="input_3_3"
          className="textarea large"
          aria-required="true"
          aria-invalid="false"
          rows="10"
          cols="50"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  )
}

const isFieldTypeValid = type => {
  return ["section", "hidden", "name", "textarea"].includes(type)
}

const FormField = ({ formId, field }) => {
  // We only process specific fields.
  if (!isFieldTypeValid(field.type)) {
    console.log(field)
    return null
  }

  /*
   * @TODO possible CSS:
   * field_sublabel_below
   * field_description_below
   * gfield_visibility_visible
   * gfield_contains_required
   */

  let fieldAttrs = {
    id: cssFieldIdPrefix(formId, field.id),
  }

  const fieldClass = [cssFieldPrefix]

  if (field.type) {
    fieldClass.push(cssFieldTypePrefix(field.type))
  }

  // Add classes to attributes.
  fieldAttrs = addClasses(fieldAttrs, fieldClass)

  const fieldInfo = {
    formId: formId,
    field: field,
  }

  let fieldMarkup

  switch (field.type) {
    case "section":
      fieldMarkup = <FormFieldSection {...fieldInfo} />
      break
    case "name":
      fieldMarkup = <FormFieldName {...fieldInfo} />
      break
    case "email":
      fieldMarkup = <FormFieldEmail {...fieldInfo} />
      break
    case "hidden":
      fieldMarkup = <FormFieldHidden {...fieldInfo} />
      break
    case "textarea":
      fieldMarkup = <FormFieldTextarea {...fieldInfo} />
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
  formId: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
}

const FormFields = ({ formId, fields }) => {
  const cssFieldsPrefix = `${cssFormPrefix}__fields`

  console.log(fields)

  // @TODO possible CSS: top_label form_sublabel_below description_below

  let fieldsAttr = {
    id: `${cssFieldsPrefix}-${formId}`,
    className: cssFieldsPrefix,
  }

  return (
    <div {...fieldsAttr}>
      {fields.map((field, i) => (
        <FormField key={i} formId={formId} field={field} />
      ))}
    </div>
  )
}

FormFields.propTypes = {
  formId: PropTypes.number.isRequired,
  fields: PropTypes.array.isRequired,
}

/*
 * @TODO:
 * - Add action
 */
const Form = ({ data }) => {
  if (!data.formId) {
    return null
  }

  // Start building form information.
  let formAttr = {
    action: "",
    method: "post",
    id: `${cssFormPrefix}-${data.formId}`,
  }

  const formClass = [cssFormPrefix]

  if (data.cssClass) {
    formClass.push(data.cssClass)
  }

  // Add classes to attributes.
  formAttr = addClasses(formAttr, formClass)

  return (
    <form {...formAttr}>
      <FormFields formId={data.formId} fields={data.formFields} />
    </form>
  )
}

Form.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Form
