import { encodeBase58 } from 'ethers'
import { TLink } from "../types"

type TEncodeLink = (
  claimHost: string,
  link: TLink
) => string | void

const encodeLink: TEncodeLink = (
  claimHost,
  link
) => {
  const linkKey = encodeBase58(link.linkKey)
  const transferId = encodeBase58(link.transferId) // string -> hex -> base58 for shorter string
  if (link.senderSig) {
    const sigLength = (link.senderSig.length - 2) / 2
    const sig = encodeBase58(link.senderSig)
    return `${claimHost}/#/code?k=${linkKey}&sg=${sig}&i=${transferId}&c=${link.chainId}&v=3&sgl=${sigLength}&src=p2p`
  } else {
    return `${claimHost}/#/code?k=${linkKey}&c=${link.chainId}&v=3&src=p2p`
  }
}

export default encodeLink
