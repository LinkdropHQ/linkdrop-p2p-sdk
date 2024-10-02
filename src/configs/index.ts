import {
  ETokenAddress,
  ESelectors
} from '../types'

export const baseUrl = 'http://localhost:3000'
export const apiUrl = 'https://escrow-api.linkdrop.io/v3'
export const dashboardApiUrl = 'https://escrow-api.linkdrop.io/dashboard'
export const devDashboardApiUrl = 'https://escrow-api.linkdrop.io/dev-dashboard'

export const nativeTokenAddress = '0x0000000000000000000000000000000000000000'

export const cbwEscrowContract = '0xedfea6336c922f896c7e09ba282beb0cb4476675'
export const mainEscrowContract = '0x139b79602b68e8198ea3d57f5e6311fd98262269'

export const cbwEscrowContractNFT = '0xff3471dfdc6f82694e5ad4d4e7ffedf23e1e38e0'
export const mainEscrowContractNFT = '0xe0cec4f0b66257fc6b13652c303237de0fd92ed8'

export const immutableZkevmContract = '0x4366caf3963d147da4a4287061354058d871d1be'
export const immutableZkevmContractNFT = '0x317d2501396fe75d997799bf3bdbc7cc6768b533'


export const supportedStableCoins = {
  [ETokenAddress.usdcBase]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.eurcBase]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcBaseGoerli]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcBridgedPolygon]: ESelectors.approveWithAuthorization,
  [ETokenAddress.usdcSepolia]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcPolygon]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcArbitrum]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcOptimism]: ESelectors.receiveWithAuthorization,
  [ETokenAddress.usdcAvalanche]: ESelectors.receiveWithAuthorizationEOA,
  [ETokenAddress.cbBTC]: ESelectors.receiveWithAuthorizationEOA
}
