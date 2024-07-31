import * as configs from '../configs'
import { TDeploymentType, TTokenType } from '../types'
import defineVersionByEscrow from './define-version-by-escrow'

type TDefineIfEscrowAddressIsCorrect = (
  escrowAddress: string,
  tokenType: TTokenType,
  deployment: TDeploymentType
) => boolean

const defineIfEscrowAddressIsCorrect: TDefineIfEscrowAddressIsCorrect = (
  escrowAddress,
  tokenType,
  deployment
) => {

  if (!escrowAddress || !tokenType) {
    return false
  }

  if (deployment === 'CBW') {
    if (tokenType === 'ERC1155' || tokenType === 'ERC721') {
      if (escrowAddress !== configs.cbwEscrowContractNFT) {
        // check if was created with previous version

        const versionOfEscrow = defineVersionByEscrow(escrowAddress)
        if (versionOfEscrow) {
          return true
        }

        return false
      }
      return true
    }
    if (escrowAddress !== configs.cbwEscrowContract) {
      const versionOfEscrow = defineVersionByEscrow(escrowAddress)
      if (versionOfEscrow) {
        return true
      }
      return false
    }
    return true
  }

  if (tokenType === 'ERC1155' || tokenType === 'ERC721') {
    if (escrowAddress !== configs.mainEscrowContractNFT) {
      const versionOfEscrow = defineVersionByEscrow(escrowAddress)
      if (versionOfEscrow) {
        return true
      }
      return false
    }
    return true
  }

  if (escrowAddress !== configs.mainEscrowContract) {
    const versionOfEscrow = defineVersionByEscrow(escrowAddress)
    if (versionOfEscrow) {
      return true
    }
    return false
  }
  
  return true
}

export default defineIfEscrowAddressIsCorrect