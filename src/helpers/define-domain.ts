import {
  ETokenAddress, TDomain, EChains
} from '../types'
import {
  polygonUSDCBridged,
  polygonUSDC,
  optimismUSDC,
  avalancheUSDC,
  arbitrumUSDC,
  baseGoerliUSDC,
  baseUSDC,
  sepoliaUSDC,
  baseEURC,
  baseCBBTC
} from '../domains'

type TDefineDomain = (
  chainId: number | null,
  tokenAddress: string
) => TDomain | null

const defineDomain: TDefineDomain = (
  chainId,
  tokenAddress
) => {
  if (chainId === EChains.polygon) {
    if (tokenAddress === ETokenAddress.usdcBridgedPolygon) {
      return polygonUSDCBridged
    }
    return polygonUSDC
  }

  if (chainId === EChains.avalanche) { // avalanche
    if (tokenAddress === ETokenAddress.usdcAvalanche) return avalancheUSDC
  }

  if (chainId === EChains.optimism) { // optimism
    if (tokenAddress === ETokenAddress.usdcOptimism) return optimismUSDC
  }

  if (chainId === EChains.arbitrum) { // arbitrum
    if (tokenAddress === ETokenAddress.usdcArbitrum) return arbitrumUSDC
  }

  if (chainId === EChains.baseGoerli) {// Base Goerli
    if (tokenAddress === ETokenAddress.usdcBaseGoerli) return baseGoerliUSDC
  }

  if (chainId === EChains.sepolia) { // Sepolia
    if (tokenAddress === ETokenAddress.usdcSepolia) return sepoliaUSDC
  } 

  if (chainId === EChains.base) { // Base
    if (tokenAddress === ETokenAddress.usdcBase) return baseUSDC
    if (tokenAddress === ETokenAddress.eurcBase) return baseEURC
    if (tokenAddress === ETokenAddress.cbBTC) return baseCBBTC
  }

  return null
}

export default defineDomain