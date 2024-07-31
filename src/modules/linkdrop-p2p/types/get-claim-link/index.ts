import ClaimLink from "../../../claim-link"
import { ClaimLinkV2, ClaimLinkV3_11 } from '../../../../index'

type TGetClaimLink = (claimUrl: string) => Promise<ClaimLink | ClaimLinkV2 | ClaimLinkV3_11>

export default TGetClaimLink