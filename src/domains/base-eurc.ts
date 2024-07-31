import { EChains, ETokenAddress } from "../types"

const baseEURC = {
  name: 'EURC',
  version: '2',
  chainId: EChains.base,
  verifyingContract: ETokenAddress.eurcBase
}

export default baseEURC