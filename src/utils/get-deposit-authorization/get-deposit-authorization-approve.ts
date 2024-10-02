import { ethers } from 'ethers'
import { getNonce } from '..'
import { TDomain, TSignTypedData } from '../../types'

async function getDepositAuthorizationApprove(
  signTypedData: TSignTypedData,
  sender: string,
  to: string,
  amount: string,
  validAfter: number,
  validBefore: number,
  transferId: string,
  expiration: string,
  feeAmount: string,
  domain: TDomain
) {
  // The EIP-712 type data
  const types = {
    'ApproveWithAuthorization': [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  }
  const nonce = getNonce(sender, transferId, amount, expiration, feeAmount)
  const message = {
    owner: sender,
    spender: to,
    value: amount,
    validAfter,
    validBefore,
    nonce
  }

  const signature = await signTypedData(domain, types, message)
  const signatureSplit = ethers.Signature.from(signature)
  
  // Encode the authorization
  const coder = ethers.AbiCoder.defaultAbiCoder()

  const authorization = coder.encode(
    ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32', 'uint8', 'bytes32', 'bytes32'],
    [message.owner, message.spender, message.value, message.validAfter, message.validBefore, message.nonce, signatureSplit.v, signatureSplit.r, signatureSplit.s]
  )

  return authorization
}

export default getDepositAuthorizationApprove
