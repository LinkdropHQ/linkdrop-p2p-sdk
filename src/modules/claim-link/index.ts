import IClaimLinkSDK, {
  TGetCurrentFee,
  TRedeem,
  TUpdateAmount,
  TConstructorArgs,
  TDepositWithAuthorization,
  TGenerateClaimUrl,
  TDefineDomain,
  TGetStatus,
  TDeposit,
  TDefineValue,
  TDepositERC20,
  TDepositNative,
  TDepositERC721,
  TDepositERC1155,
  TGetDepositParams,
  TIsDepositWithAuthorizationAvailable
} from './types'
import { toBigInt } from 'ethers'
import {
  TEscrowPaymentDomain,
  TLink,
  TTokenType,
  TClaimLinkOperation,
  TGetRandomBytes,
  TClaimLinkItemStatus,
  TClaimLinkSource,
  TDeploymentType,
  ESelectors,
  TDomain
} from '../../types'
import { ValidationError } from '../../errors'
import { LinkdropEscrowToken, LinkdropEscrowNFT } from '../../abi'
import {
  generateReceiverSig,
  getDepositAuthorization,
  getValidAfterAndValidBefore,
  generateLinkKeyandSignature
} from "../../utils"
import { linkApi } from '../../api'
import {
  defineEscrowAddress,
  defineIfEscrowAddressIsCorrect,
  encodeLink,
  parseLink,
  updateOperations,
  defineDomain,
  defineVersionByEscrow,
  getClaimCodeFromDashboardLink,
  defineSelector
} from '../../helpers'
import { errors } from '../../texts'
import * as configs from '../../configs'
import { ethers } from 'ethers'

class ClaimLink implements IClaimLinkSDK {
  sender: string
  token: string
  expiration: number
  chainId: number
  #apiKey: string | null
  apiUrl: string
  baseUrl: string
  escrowAddress: string | null
  getRandomBytes: TGetRandomBytes
  transferId: string
  claimUrl: string
  tokenType: TTokenType
  operations: TClaimLinkOperation[]
  linkKey: string | null
  deposited: boolean = false

  tokenId: string

  feeAuthorization: string
  amount: string
  totalAmount: string
  feeAmount: string
  feeToken: string
  source: TClaimLinkSource

  forRecipient: boolean

  deployment: TDeploymentType

  status: TClaimLinkItemStatus

  constructor({
    sender,
    token,
    amount,
    feeAmount,
    totalAmount,
    expiration,
    chainId,
    apiUrl,
    baseUrl,
    apiKey,
    transferId,
    tokenType,
    escrowAddress,
    operations,
    linkKey,
    getRandomBytes,
    feeAuthorization,
    feeToken,
    claimUrl,
    tokenId,
    forRecipient,
    status,
    source,
    deployment
  }: TConstructorArgs) {

    this.getRandomBytes = getRandomBytes

    if (!sender) {
      throw new ValidationError(
        errors.argument_not_provided('sender', String(sender)),
        'SENDER_NOT_PROVIDED'
      )
    }

    this.deployment = deployment

    this.forRecipient = Boolean(forRecipient)

    if (tokenType === 'ERC721' || tokenType === 'ERC1155') {
      if (!tokenId) {
        throw new ValidationError(
          errors.argument_not_provided('tokenId', String(tokenId)),
          'TOKEN_ID_NOT_PROVIDED'
        )
      }
      this.tokenId = tokenId
    }

    if (status) {
      this.status = status
    }
    this.source = source || 'p2p'

    this.sender = sender.toLowerCase()
    this.feeAmount = feeAmount
    this.totalAmount = totalAmount
    if (feeAuthorization) {
      this.feeAuthorization = feeAuthorization
    }
    if (feeToken) {
      this.feeToken = feeToken.toLowerCase()
    }
    if (tokenType !== 'ERC721' && !amount) {
      throw new ValidationError(
        errors.argument_not_provided('amount', String(amount)),
        'AMOUNT_NOT_PROVIDED'
      )
    } else {
      this.amount = amount
    }
    this.operations = operations || []
    this.expiration = expiration
    if (!chainId) {
      throw new ValidationError(
        errors.argument_not_provided('chainId', String(chainId)),
        'CHAIN_ID_NOT_PROVIDED'
      )
    }
    this.chainId = chainId
    this.apiUrl = apiUrl
    this.#apiKey = apiKey
    if (!tokenType) {
      throw new ValidationError(
        errors.argument_not_provided('tokenType', String(tokenType)),
        'TOKEN_TYPE_NOT_PROVIDED'
      )
    }
    this.tokenType = tokenType

    if (tokenType === 'NATIVE') {
      this.token = configs.nativeTokenAddress
    } else {
      if (!token) {
        throw new ValidationError(
          errors.argument_not_provided('token', String(token)),
          'TOKEN_NOT_PROVIDED'
        )
      }
      this.token = token.toLowerCase()
    }

    this.escrowAddress = escrowAddress?.toLowerCase() || defineEscrowAddress(
      this.chainId,
      this.tokenType,
      this.deployment
    )

    if (!this.escrowAddress) {
      if (this.source !== 'd') {
        throw new Error(errors.escrow_not_available(
          this.token,
          this.chainId
        ))
      }

    }

    if (this.source !== 'd') {
      if (!defineIfEscrowAddressIsCorrect(
        this.escrowAddress as string,
        this.tokenType,
        this.deployment,
        this.chainId
      )) {
        throw new Error(errors.escrow_is_not_correct())
      }
    }


    if (!transferId) {
      throw new ValidationError(
        errors.argument_not_provided('transferId', String(transferId)),
        'TRANSFER_ID_NOT_PROVIDED'
      )
    }

    this.transferId = transferId.toLowerCase()

    if (linkKey) {
      this.linkKey = linkKey
    }

    if (claimUrl) {
      this.claimUrl = claimUrl
    }

    this.baseUrl = baseUrl || configs.baseUrl
  }

  getDepositParams: TGetDepositParams = () => {
    let data
    if (!this.escrowAddress) {
      throw new Error(errors.property_not_provided('escrowAddress', String(this.escrowAddress)))
    }
    if (this.tokenType === 'ERC20') {
      const iface = new ethers.Interface(LinkdropEscrowToken.abi)
      data = iface.encodeFunctionData("deposit", [
        this.token,
        this.transferId,
        this.totalAmount,
        this.expiration,
        this.feeToken,
        this.feeAmount,
        this.feeAuthorization
      ])
    } else if (this.tokenType === 'NATIVE') {
      const iface = new ethers.Interface(LinkdropEscrowToken.abi)
      data = iface.encodeFunctionData("depositETH", [
        this.transferId,
        this.totalAmount,
        this.expiration,
        this.feeAmount,
        this.feeAuthorization
      ])
    } else if (this.tokenType === 'ERC721') {
      const iface = new ethers.Interface(LinkdropEscrowNFT.abi)
      data = iface.encodeFunctionData("depositERC721", [
        this.token,
        this.transferId,
        this.tokenId,
        this.expiration,
        this.feeAmount,
        this.feeAuthorization
      ])
    } else {
      const iface = new ethers.Interface(LinkdropEscrowNFT.abi)
      data = iface.encodeFunctionData("depositERC1155", [
        this.token,
        this.transferId,
        this.tokenId,
        this.amount,
        this.expiration,
        this.feeAmount,
        this.feeAuthorization
      ])
    }

    const value = this._defineValue(
      this.token,
      this.feeToken,
      this.totalAmount,
      this.feeAmount
    )

    return {
      value,
      data,
      to: this.escrowAddress,
    }
  }

  redeem: TRedeem = async (dest) => {
    if (!dest) {
      throw new ValidationError(
        errors.argument_not_provided('dest', String(dest)),
        'DESTINATION_ADDRESS_NOT_PROVIDED'
      )
    }

    if (!this.escrowAddress) {
      if (this.source !== 'd') {
        throw new Error(errors.escrow_not_available(
          this.token,
          this.chainId
        ))
      }
    }

    if (!this.claimUrl) {
      throw new Error(errors.cannot_redeem_before_deposit())
    }

    if (this.source === 'd') {
      const claimCode = getClaimCodeFromDashboardLink(this.claimUrl)
      const linkKey = ethers.id(claimCode)
      const receiverSignature = await generateReceiverSig(linkKey, dest)
      const redeem = await linkApi.redeemLink(
        this.apiUrl,
        this.#apiKey,
        dest,
        this.transferId,
        receiverSignature
      )
      const { tx_hash: txHash } = redeem
      return txHash
    }
    const decodedLinkParams = parseLink(this.claimUrl)
    if (!decodedLinkParams) {
      throw new Error(errors.link_decode_failed())
    }
    const { senderSig, linkKey } = decodedLinkParams
    const receiverSig = await generateReceiverSig(linkKey, dest)
    if (senderSig) {
      const redeem = await linkApi.redeemRecoveredLink(
        this.apiUrl,
        this.#apiKey,
        dest,
        this.sender.toLowerCase(),
        this.escrowAddress as string,
        this.transferId,
        receiverSig,
        senderSig,
        this.token
      )
      const { tx_hash: txHash } = redeem
      return txHash
    } else {
      const redeem = await linkApi.redeemLink(
        this.apiUrl,
        this.#apiKey,
        dest,
        this.transferId,
        receiverSig,
        this.token,
        this.sender.toLowerCase(),
        this.escrowAddress as string,
      )
      const { tx_hash: txHash } = redeem
      return txHash
    }
  }

  getStatus: TGetStatus = async () => {
    if (!this.transferId) {
      throw new Error(errors.property_not_provided('transferId', String(this.transferId)))
    }

    const { claim_link } = await linkApi.getTransferStatus(
      this.apiUrl,
      this.#apiKey,
      this.transferId
    )

    const operations = updateOperations(claim_link.operations)

    if (claim_link.status !== this.status) {
      this.status = claim_link.status
      this.operations = operations
    }

    return {
      status: claim_link.status,
      operations
    }
  }

  _defineDomain: TDefineDomain = () => {
    return defineDomain(this.chainId, this.token)
  }

  _defineValue: TDefineValue = (
    tokenAddress,
    feeToken,
    totalAmount,
    feeAmount
  ) => {
    if (feeToken === tokenAddress && tokenAddress !== configs.nativeTokenAddress) {
      // stablecoin
      return '0'
    }
    if (tokenAddress === configs.nativeTokenAddress) {
      // native token
      return totalAmount
    }

    // erc20
    return feeAmount
  }

  _depositERC20: TDepositERC20 = async ({
    sendTransaction
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    const { data, value, to } = this.getDepositParams()

    const { hash: txHash } = await sendTransaction({
      data,
      value,
      to
    })

    await linkApi.deposit(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.tokenType,
      this.sender.toLowerCase(),
      this.escrowAddress as string,
      this.transferId,
      this.expiration,
      txHash,
      this.feeAuthorization,
      this.amount,
      this.feeAmount,
      this.totalAmount,
      this.feeToken
    )

    const linkParams: TLink = {
      linkKey: this.linkKey as string,
      transferId: this.transferId,
      chainId: this.chainId,
      sender: this.sender.toLowerCase()
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl
    this.deposited = true

    return {
      txHash,
      transferId: this.transferId,
      claimUrl
    }
  }

  _depositNative: TDepositNative = async ({
    sendTransaction
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    const { data, value, to } = this.getDepositParams()

    const { hash: txHash } = await sendTransaction({
      data,
      value,
      to
    })

    await linkApi.deposit(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.tokenType,
      this.sender.toLowerCase(),
      this.escrowAddress as string,
      this.transferId,
      this.expiration,
      txHash,
      this.feeAuthorization,
      this.amount,
      this.feeAmount,
      this.totalAmount,
      this.feeToken
    )

    const linkParams: TLink = {
      linkKey: this.linkKey as string,
      transferId: this.transferId,
      chainId: this.chainId,
      sender: this.sender.toLowerCase()
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl
    this.deposited = true

    return {
      txHash,
      transferId: this.transferId,
      claimUrl
    }
  }

  _depositERC1155: TDepositERC1155 = async ({
    sendTransaction
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    const { data, value, to } = this.getDepositParams()
    const { hash: txHash } = await sendTransaction({
      data,
      value,
      to
    })

    await linkApi.depositERC1155(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.tokenType,
      this.sender.toLowerCase(),
      this.escrowAddress as string,
      this.transferId,
      this.expiration,
      txHash,
      this.feeAuthorization,
      this.tokenId,
      this.amount,
      this.feeAmount,
      this.totalAmount,
      this.feeToken
    )

    const linkParams: TLink = {
      linkKey: this.linkKey as string,
      transferId: this.transferId,
      chainId: this.chainId,
      sender: this.sender.toLowerCase()
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl
    this.deposited = true

    return {
      txHash,
      transferId: this.transferId,
      claimUrl
    }
  }

  _depositERC721: TDepositERC721 = async ({
    sendTransaction
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    const { data, value, to } = this.getDepositParams()

    const { hash: txHash } = await sendTransaction({
      data,
      value,
      to
    })

    await linkApi.depositERC721(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.tokenType,
      this.sender.toLowerCase(),
      this.escrowAddress as string,
      this.transferId,
      this.expiration,
      txHash,
      this.feeAuthorization,
      this.tokenId,
      this.feeAmount,
      this.totalAmount,
      this.feeToken
    )

    const linkParams: TLink = {
      linkKey: this.linkKey as string,
      transferId: this.transferId,
      chainId: this.chainId,
      sender: this.sender.toLowerCase()
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl
    this.deposited = true

    return {
      txHash,
      transferId: this.transferId,
      claimUrl
    }
  }

  deposit: TDeposit = async ({
    sendTransaction
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    if (!this.linkKey) {
      throw new Error(errors.cannot_deposit_after_retrieve())
    }

    if (this.deposited) {
      throw new Error(errors.cannot_deposit_twice())
    }

    if (!this.escrowAddress) {
      throw new Error(errors.property_not_provided('escrowAddress', String(this.escrowAddress)))
    }

    if (!this.expiration) {
      throw new Error(errors.property_not_provided('expiration', String(this.expiration)))
    }

    if (!this.amount) {
      throw new Error(errors.property_not_provided('amount', String(this.amount)))
    }

    if (!sendTransaction) {
      throw new ValidationError(
        errors.argument_not_provided('sendTransaction', String(sendTransaction)),
        'SEND_TRANSACTION_NOT_PROVIDED'
      )
    }

    if (this.tokenType === 'NATIVE') {
      return this._depositNative({
        sendTransaction
      })
    } else if (this.tokenType === 'ERC20') {
      return this._depositERC20({
        sendTransaction
      })
    } else if (this.tokenType === 'ERC721') {
      return this._depositERC721({
        sendTransaction
      })
    } else {
      return this._depositERC1155({
        sendTransaction
      })
    }
  }

  isDepositWithAuthorizationAvailable: TIsDepositWithAuthorizationAvailable = (
    tokenAddress
  ) => {
    const authSelector = configs.supportedStableCoins[tokenAddress.toLowerCase()]
    return Boolean(authSelector)
  }

  depositWithAuthorization: TDepositWithAuthorization = async ({
    signTypedData,
    authConfig
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }

    let authSelector: ESelectors
    let domain: TDomain | null

    if (!authConfig) {
      // if there is no authConfig, then define authSelector with configs.supportedStableCoins,
      // and domain with private method of class accroding to chain and token address
      authSelector = configs.supportedStableCoins[this.token]
      domain = this._defineDomain()
    } else {
      // otherwise take domain from authConfig
      // and authSelector from helper according to authConfig.authorizationMethod
      domain = authConfig.domain
      authSelector = defineSelector(
        authConfig.authorizationMethod
      )
    }

    if (!domain) {
      throw new Error(errors.chain_not_supported())
    }

    if (!authSelector) {
      throw new ValidationError(
        errors.stable_token_not_supported(this.token),
        'TOKEN_NOT_SUPPORTED_FOR_DEPOSIT_WITH_AUTH'
      )
    }

    if (!this.linkKey) {
      throw new Error(errors.cannot_deposit_after_retrieve())
    }

    if (this.deposited) {
      throw new Error(errors.cannot_deposit_twice())
    }

    if (!signTypedData) {
      throw new ValidationError(
        errors.argument_not_provided('signTypedData', String(signTypedData)),
        'SIGN_TYPED_DATA_NOT_PROVIDED'
      )
    }

    if (this.tokenType === 'NATIVE') {
      throw new Error(errors.deposit_with_auth_wrong_type())
    }

    const [validAfter, validBefore] = getValidAfterAndValidBefore()

    if (!this.escrowAddress) {
      throw new Error(errors.property_not_provided('escrowAddress', String(this.escrowAddress)))
    }

    if (!this.expiration) {
      throw new Error(errors.property_not_provided('expiration', String(this.expiration)))
    }
    if (!this.amount) {
      throw new Error(errors.property_not_provided('amount', String(this.amount)))
    }


    const authResult = await getDepositAuthorization(
      signTypedData,
      this.sender.toLowerCase(),
      this.escrowAddress,
      this.totalAmount,
      validAfter,
      validBefore,
      this.transferId,
      String(this.expiration),
      domain,
      this.chainId,
      this.token,
      this.feeAmount,
      authSelector,

      // if last param exists, then return needed type of authorization
      // otherwise define it dynamically with chain and token
      authConfig?.authorizationMethod
    )

    const result = await linkApi.depositWithAuthorization(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.tokenType,
      this.sender.toLowerCase(),
      this.escrowAddress,
      this.transferId,
      this.expiration,
      authResult,
      authSelector,
      this.feeAuthorization,
      this.amount,
      this.feeAmount,
      this.totalAmount
    )

    const { tx_hash } = result

    const linkParams: TLink = {
      linkKey: this.linkKey,
      transferId: this.transferId,
      chainId: this.chainId,
      sender: this.sender.toLowerCase()
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl
    this.deposited = true

    return {
      txHash: tx_hash,
      claimUrl: this.claimUrl,
      transferId: this.transferId
    }
  }

  _getCurrentFee: TGetCurrentFee = async (newAmount) => {
    const result = await linkApi.getFee(
      this.apiUrl,
      this.#apiKey,
      this.token,
      this.sender.toLowerCase(),
      this.tokenType,
      this.transferId,
      this.expiration,
      newAmount,
      this.tokenId
    )

    return result
  }

  updateAmount: TUpdateAmount = async (amount) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }
    if (this.tokenType === 'ERC721') {
      throw new ValidationError(
        errors.cannot_update_amount_for_erc721(),
        'CANNOT_UPDATE_AMOUNT_FOR_ERC721'
      )
    }
    const {
      fee_amount: feeAmount,
      total_amount: totalAmount,
      min_transfer_amount: minTransferAmount,
      max_transfer_amount: maxTransferAmount,
      fee_authorization: feeAuthorization,
      fee_token: feeToken
    } = await this._getCurrentFee(
      amount as string
    )

    if (toBigInt(amount) < toBigInt(minTransferAmount)) {
      throw new ValidationError(
        errors.amount_should_be_more_than_minlimit(minTransferAmount.toString()),
        'MIN_LIMIT_FAILED'
      )
    }

    if (toBigInt(amount) > toBigInt(maxTransferAmount)) {
      throw new ValidationError(
        errors.amount_should_be_less_than_maxlimit(maxTransferAmount.toString()),
        'MAX_LIMIT_FAILED'
      )
    }

    if (!this.linkKey) {
      const statusData = await this.getStatus()
      if (statusData.status === 'created') {
        this.amount = amount
        this.feeAmount = feeAmount
        this.totalAmount = totalAmount
        this.feeAuthorization = feeAuthorization
        this.feeToken = feeToken.toLowerCase()

        return {
          amount,
          feeAmount,
          totalAmount,
          feeToken
        }
      } else {
        throw new Error(errors.cannot_update_amount())
      }
    }

    if (this.deposited) {
      throw new Error(errors.cannot_update_amount())
    }

    this.amount = amount
    this.feeAmount = feeAmount
    this.totalAmount = totalAmount
    this.feeAuthorization = feeAuthorization
    this.feeToken = feeToken.toLowerCase()

    return {
      amount,
      feeAmount,
      totalAmount,
      feeToken
    }
  }

  _getEscrowPaymentDomain = () => {
    if (!this.escrowAddress) {
      throw new Error(errors.escrow_not_available(
        this.token,
        this.chainId
      ))
    }

    const version = defineVersionByEscrow(this.escrowAddress)
    if (!version) {
      throw new Error(errors.version_not_found())
    }

    const escrowPaymentDomain: TEscrowPaymentDomain = {
      name: "LinkdropEscrow",
      version,
      chainId: this.chainId,
      verifyingContract: this.escrowAddress,
    }

    return escrowPaymentDomain
  }

  generateClaimUrl: TGenerateClaimUrl = async ({
    signTypedData
  }) => {
    if (this.forRecipient) {
      throw new Error(errors.link_only_for_claim())
    }
    if (!this.getRandomBytes) {
      throw new Error(errors.property_not_provided('getRandomBytes', String(this.getRandomBytes)))
    }

    if (!signTypedData) {
      throw new ValidationError(
        errors.argument_not_provided('signTypedData', String(signTypedData)),
        'SIGN_TYPED_DATA_NOT_PROVIDED'
      )
    }

    if (!this.transferId) {
      throw new Error(errors.property_not_provided('transferId', String(this.transferId)))
    }

    const escrowPaymentDomain = this._getEscrowPaymentDomain()

    const result = await generateLinkKeyandSignature(
      signTypedData,
      this.getRandomBytes,
      this.transferId,
      escrowPaymentDomain
    )

    const { linkKey, senderSig } = result

    const linkParams: TLink = {
      linkKey,
      senderSig,
      transferId: this.transferId,
      chainId: this.chainId
    }

    const claimUrl = encodeLink(
      this.baseUrl,
      linkParams
    )

    if (!claimUrl) {
      throw new Error(errors.not_possible_create_claim_url())
    }

    this.claimUrl = claimUrl

    return {
      claimUrl: this.claimUrl,
      transferId: this.transferId
    }
  }
}
export default ClaimLink
