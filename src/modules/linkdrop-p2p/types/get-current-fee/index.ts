import { TTokenType } from "../../../../types"

type TGetCurrentFee = (
  apiUrl: string,
  token: string,
  tokenType: TTokenType,
  sender: string,
  transferId: string,
  expiration: number,
  amount: string,
  tokenId?: string 
) => Promise<{
  amount: string
  total_amount: string
  max_transfer_amount: string
  min_transfer_amount: string
  fee_token: string
  fee_amount: string
  fee_authorization: string
}>

export default TGetCurrentFee