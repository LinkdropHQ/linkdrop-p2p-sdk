import ClaimLink from "../../../claim-link"
import { ClaimLinkV2, ClaimLinkV3_11 } from '../../../../index'

export type TRetrieveClaimLinkArgs = {
  chainId: number
  txHash?: string
  sender?: string
  transferId?: string
  customApiHost?: string
}

type TRetrieveClaimLink = ({
  chainId,
  txHash,
  sender,
  transferId,
  customApiHost
}: TRetrieveClaimLinkArgs) => Promise<ClaimLink | ClaimLinkV2 | ClaimLinkV3_11>

export default TRetrieveClaimLink