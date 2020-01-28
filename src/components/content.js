import PropTypes from "prop-types"
import React from "react"

import { User } from "../user/context"

const Content = ({ children, wpc_protected }) => {
  const displayContent = () => {
    return children
  }
  // @TODO need to customize message.
  const displayProtectedMessage = () => {
    return <p>This content is for members only.</p>
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

Content.propTypes = {
  children: PropTypes.node.isRequired,
  wpc_protected: PropTypes.object,
}

Content.defaultProps = {
  wpc_protected: {
    protected: false,
    user_roles: [],
  },
}

export default Content
