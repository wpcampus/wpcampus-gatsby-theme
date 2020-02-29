import React, { useState, useContext } from "react"

import { User } from "../user/context"
import messages from "../user/messages"

const LoginForm = () => {
  const initialState = {
    alert: false,
    processing: false,
    username: null,
    password: null,
    usernameInvalid: false,
    passwordInvalid: false,
  }
  const [state, setState] = useState(initialState)
  const UserContext = useContext(User)

  const IDs = {
    alert: "login-alert",
    username: "login-user",
    usernameLabel: "login-user-label",
    usernameLabelError: "login-user-label-error",
    password: "login-pass",
    passwordLabel: "login-pass-label",
    passwordLabelError: "login-pass-label-error",
  }

  const changeField = event => {
    let name = event.target.name
    if (!["username", "password"].includes(name)) {
      return
    }

    let value = event.target.value.trim()
    let invalidKey = name + "Invalid"
    let invalidValue = !value ? messages[name + "_empty"] : false

    setState({
      ...state,
      [invalidKey]: invalidValue,
      [name]: value,
    })
  }

  const submitLogin = async event => {
    event.preventDefault()
    event.stopPropagation()

    let { username, password, usernameInvalid, passwordInvalid } = state

    let errorCount = 0

    if (!username) {
      usernameInvalid = messages.username_empty
      errorCount++
    } else {
      usernameInvalid = false
    }

    if (!password) {
      passwordInvalid = messages.password_empty
      errorCount++
    } else {
      passwordInvalid = false
    }

    // Reset errors.
    setState({
      ...state,
      usernameInvalid: usernameInvalid,
      passwordInvalid: passwordInvalid,
      alert: errorCount ? messages.login_errors : false,
      processing: errorCount ? false : true,
    })

    if (!username) {
      document.getElementById(IDs.username).focus()
      return
    }

    if (!password) {
      document.getElementById(IDs.password).focus()
      return
    }

    await UserContext.login(username, password)
      .then(response => {
        if (!response.user || !response.user.ID) {
          throw new Error(messages.login_error)
        }
      })
      .catch(error => {
        // The response sometimes sends HTML. Ugh.
        let div = document.createElement("div")
        div.innerHTML = error.message
        let errorText = div.textContent || div.innerText || ""

        // @TODO need to setup a "lost password" page.
        /*if (
          errorText.startsWith(
            "ERROR: The password you entered for the username"
          )
        )*/
        errorText = errorText.replace(/^ERROR:\s/, "")

        // Set the field errors.
        if (errorText.startsWith("This username is unknown")) {
          document.getElementById(IDs.username).focus()
          usernameInvalid = errorText
          errorText = messages.login_errors
        } else if (errorText.startsWith("The password you entered")) {
          document.getElementById(IDs.password).focus()
          passwordInvalid = errorText
          errorText = messages.login_errors
        } else if (errorText.startsWith("NetworkError")) {
          errorText = messages.login_error
        }

        setState({
          ...state,
          alert: errorText,
          processing: false,
          usernameInvalid: usernameInvalid,
          passwordInvalid: passwordInvalid,
        })
      })
  }

  const classes = {
    form: "form--login",
    alert: "form--login__alert",
    alertHidden: "for-screen-reader",
    label: "form--login__label",
    inputWrapper: "form--login__inputWrapper",
    input: "form--login__input",
    inputError: "form--login__input_error",
    submit: "form--login__submit",
  }

  if (state.processing) {
    classes.form += " form--login--processing"
  }

  const formAttr = {
    action: "",
    name: "login",
    className: classes.form,
  }

  const alertAttr = {
    id: IDs.alert,
    className: classes.alert,
    role: "alert",
  }

  if (!state.alert) {
    alertAttr.className += " " + classes.alertHidden
  }

  const usernameAttr = {
    id: IDs.username,
    className: classes.input,
    type: "text",
    name: "username",
    placeholder: "Username",
    required: "required",
    "aria-required": "true",
    "aria-labelledby": `${IDs.usernameLabel} ${IDs.usernameLabelError}`,
    onBlur: event => changeField(event),
    onChange: event => changeField(event),
  }

  if (state.usernameInvalid) {
    usernameAttr["aria-invalid"] = "true"
  }

  const passwordAttr = {
    id: IDs.password,
    className: classes.input,
    type: "password",
    name: "password",
    placeholder: "Password",
    required: "required",
    "aria-required": "true",
    "aria-labelledby": `${IDs.passwordLabel} ${IDs.passwordLabelError}`,
    onBlur: event => changeField(event),
    onChange: event => changeField(event),
  }

  if (state.passwordInvalid) {
    passwordAttr["aria-invalid"] = "true"
  }

  const submitAttr = {
    className: classes.submit,
    type: "submit",
    value: "Login",
  }

  return (
    <form {...formAttr} onSubmit={event => submitLogin(event)}>
      <p {...alertAttr} aria-live="polite">
        {state.alert}
      </p>
      <label
        id={IDs.usernameLabel}
        htmlFor={IDs.username}
        className={classes.label}
      >
        Username
      </label>
      <div className={classes.inputWrapper}>
        <input {...usernameAttr} />
        <div id={IDs.usernameLabelError} className={classes.inputError}>
          {state.usernameInvalid}
        </div>
      </div>
      <label
        id={IDs.passwordLabel}
        htmlFor={IDs.username}
        className={classes.label}
      >
        Password:
      </label>
      <div className={classes.inputWrapper}>
        <input {...passwordAttr} />
        <div id={IDs.passwordLabelError} className={classes.inputError}>
          {state.passwordInvalid}
        </div>
      </div>
      <input {...submitAttr} onClick={event => submitLogin(event)} />
    </form>
  )
}

export default LoginForm
