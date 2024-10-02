import {
  TSignTypedData,
  TDepositResult,
  TDomain,
  TAuthorizationMethod
} from "../../../../types"

type TDepositWithAuthorizationArgs = {
  signTypedData: TSignTypedData,
  authConfig?: {
    domain: TDomain
    authorizationMethod: TAuthorizationMethod
  }
}

type TDepositWithAuthorization = ({
  signTypedData,
  authConfig
}: TDepositWithAuthorizationArgs) => Promise<TDepositResult>

export default TDepositWithAuthorization
