import decodeLink from "./decode-link"
import { decodeSenderAddress } from "../utils"
import { ethers } from "ethers"
import { TEscrowPaymentDomain } from "../types"
// ok for now, should be changed
type TParseLink = (
  chainId: number,
  escrowAddress: string,
  link: string
) => Promise<{
  senderSig: string,
  linkKey: string,
  transferId: string,
  sender: string
}>

const parseLink: TParseLink = async (
  chainId,
  escrowAddress,
  link
) => {
  const decodedLink = decodeLink(link)
  const linkKeyId = (new ethers.Wallet(decodedLink.linkKey)).address
  const escrowPaymentDomain: TEscrowPaymentDomain = {
    name: "LinkdropEscrow",
    version: "1",
    chainId: chainId,
    verifyingContract: escrowAddress,
  }

  const sender = decodeSenderAddress(
    linkKeyId,
    decodedLink.transferId,
    decodedLink.senderSig,
    escrowPaymentDomain
  )
  return {
    senderSig: decodedLink.senderSig,
    linkKey: decodedLink.linkKey,
    transferId: decodedLink.transferId,
    sender,
    chainId
  }
}

export default parseLink