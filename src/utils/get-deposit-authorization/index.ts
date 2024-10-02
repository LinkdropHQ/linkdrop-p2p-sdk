
import { TDomain, TSignTypedData, ETokenAddress, TAuthorizationMethod } from '../../types'
import getDepositAuthorizationApprove from './get-deposit-authorization-approve'
import getDepositAuthorizationReceive from './get-deposit-authorization-receive'
import { EChains } from '../../types'

async function getDepositAuthorization(
  signTypedData: TSignTypedData,
  sender: string,
  to: string,
  amount: string,
  validAfter: number,
  validBefore: number,
  transferId: string,
  expiration: string,
  domain: TDomain,
  chainId: number,
  token: string,
  feeAmount: string,
  authSelector: string,
  authorizationMethod?: TAuthorizationMethod
) {
  if (authorizationMethod) {
    if (authorizationMethod === 'ApproveWithAuthorization') {
      return getDepositAuthorizationApprove(
        signTypedData,
        sender,
        to,
        amount,
        validAfter,
        validBefore,
        transferId,
        expiration,
        feeAmount,
        domain
      )
    }
    return getDepositAuthorizationReceive(
      signTypedData,
      sender,
      to,
      amount,
      validAfter,
      validBefore,
      transferId,
      expiration,
      feeAmount,
      domain,
      authSelector
    )
  }

  if (chainId === EChains.polygon) {
    if (token === ETokenAddress.usdcBridgedPolygon) {
      return getDepositAuthorizationApprove(
        signTypedData,
        sender,
        to,
        amount,
        validAfter,
        validBefore,
        transferId,
        expiration,
        feeAmount,
        domain
      )
    }
  }

  return getDepositAuthorizationReceive(
    signTypedData,
    sender,
    to,
    amount,
    validAfter,
    validBefore,
    transferId,
    expiration,
    feeAmount,
    domain,
    authSelector
  )
}

export default getDepositAuthorization
