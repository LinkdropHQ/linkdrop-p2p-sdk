import { EChains, ETokenAddress } from "../types"

const baseGoerliUSDC = {
  name: 'USD Coin',  
  version: '2',
  chainId: EChains.baseGoerli,
  verifyingContract: ETokenAddress.usdcBaseGoerli
}

export default baseGoerliUSDC