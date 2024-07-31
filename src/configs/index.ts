import {
  ETokenAddress,
  ESelectors 
} from '../types'

export const baseUrl = 'http://localhost:3000'
export const apiUrl = 'https://escrow-api.linkdrop.io/v3'
export const dashboardApiUrl = 'https://escrow-api.linkdrop.io/dashboard'

export const nativeTokenAddress = '0x0000000000000000000000000000000000000000'

export const cbwEscrowContract = '0x7143f68e689e8540a8eec26b482e1d4ac2e28794'
export const mainEscrowContract = '0x88d51990a3b962f975846f3688e36d2a1fc611f1'

export const cbwEscrowContractNFT = '0xe07fa88a10a915b7339aff050db82c0030bf6861'
export const mainEscrowContractNFT = '0x648b9a6c54890a8fb17de128c6352f621154f358'

export const supportedStableCoins = {
  [ETokenAddress.usdcBase]: ESelectors.receiveWithAuthorization,

  [ETokenAddress.eurcBase]: ESelectors.receiveWithAuthorization,

  [ETokenAddress.usdcBaseGoerli]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcBridgedPolygon]: ESelectors.approveWithAuthorization,
  [ETokenAddress.usdcSepolia]:  ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcPolygon]:  ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcArbitrum]:  ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcOptimism]:  ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcAvalanche]:  ESelectors.receiveWithAuthorization
}
