import PropTypes from "prop-types"
import React from "react"
import ReactHtmlParser from "react-html-parser"

import { User } from "../user/context"

const defaultProtectedMessage = "<p>This content is restricted.</p>"

const ProtectedContent = ({ children, wpc_protected }) => {
  const displayContent = () => {
    return children
  }
  // @TODO need to customize message.
  const displayProtectedMessage = () => {
    if (wpc_protected.message) {
      return ReactHtmlParser(wpc_protected.message)
    }
    return ReactHtmlParser(defaultProtectedMessage)
  }
  const handleProtectedContent = user => {
    if (!user.isActive()) {
      return ""
    }
    if (!user.isLoggedIn()) {
      return displayProtectedMessage()
    }
    /*
     * @TODO Need to consider how we want this handled for administrators.
     */
    if (wpc_protected.user_roles.disable) {
      if (user.user.roles.filter(value => wpc_protected.user_roles.disable.includes(value)).length) {
        return displayProtectedMessage()
      }
    }
    if (wpc_protected.user_roles.enable) {
      if (!user.user.roles.filter(value => wpc_protected.user_roles.enable.includes(value)).length) {
        return displayProtectedMessage()
      }
    }
    return displayContent()
  }
  if (wpc_protected.protected) {
    return <User.Consumer>{handleProtectedContent}</User.Consumer>
  }
  return displayContent()
}

ProtectedContent.propTypes = {
  children: PropTypes.node.isRequired,
  wpc_protected: PropTypes.object,
}

ProtectedContent.defaultProps = {
  wpc_protected: {
    protected: false,
    user_roles: [],
    message: defaultProtectedMessage,
  },
}

export default ProtectedContent
