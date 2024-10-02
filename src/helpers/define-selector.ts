import { TAuthorizationMethod, ESelectors } from "../types"

const defineSelector = (authorizationMethod: TAuthorizationMethod) => {
  if (authorizationMethod === 'ApproveWithAuthorization') {
    return ESelectors.approveWithAuthorization
  }

  if (authorizationMethod === 'ReceiveWithAuthorizationEOA') {
    return ESelectors.receiveWithAuthorizationEOA
  }

  return ESelectors.receiveWithAuthorization
}

export default defineSelector
