# Linkdrop SDK

## 3.13.2-beta


## 3.13.1-beta
- update for depositWithAuthorization method (additional params available)

## 3.13.0-beta
- depositWithAuthorization method support for cbBTC
- package rename to linkdrop-sdk

## 3.12.4-beta
- immutable-zkevm network support added
- error handling update
- 15 days expiration of link by default

## 3.12.3-beta
- support for EURC coin (base network)

## 3.12.2-beta
- support for v3 links

## 3.12.1-beta
- bug fix for old escrow contract links

## 3.12.0-beta
- new escrow contract addresses for CBW users

## 3.11.0-beta
- bug fixes for ERC1155/ERC721
- added signature length query variable for recovered link

## 3.10.0-beta
- update for getLimits method (usd limits added)

## 3.9.1-alpha
- update for zupla error handling

## 3.9.0-beta
- added Degen network support

## 3.8.0-beta
- added Sepolia network support
- removed Mumbai network support

## 3.7.0-beta
- added machine-readable error handling

## 3.6.0-beta
- support for new dashboard URL schema

## 3.5.0-beta
- Escrow contracts update
- added optional "deployment" param to LinkdropP2P constructor

## 3.4.0-beta
- Added getDepositParams method
- Removed sender address check in generateClaimUrl method

## 3.3.0-beta
- Dashboard links retrieve and redeem
- Added isDepositWithAuthorizationAvailable method to ClaimLink
- Added error handling for api requests
- operations format changed (snake_case to camelCase)

## 3.2.0-beta
- Arbitrum, Optimism, Avalanche networks support

## 3.1.1-beta
- enum ETokenType => type TTokenType

## 3.1.0-beta
- backward compatibility (v2 => v3)
- ERC721 and ERC1155 tokens support

## 3.0.0-beta.2
- updates for limits (moved from createClaimLink to _initializeClaimLink)

## 3.0.0-beta.1
- added new escrow address contracts
- updates for README.md

## 3.0.0-alpha.0
- added ERC20 token support
- updated LinkdropP2P constructor
- updated methods for ClaimLink (deposit, depositWithAuthorization)
- removed token symbol from claim url
- transfer status can be retrieved with transferId (sender not needed)
- updated handling of errors
- added all fee data to endpoints

## 2.0.0-beta.5
- removed extra request to get limits

## 2.0.0-beta.4
- added error handling to method getVersionFromEscrowContract
- updated README

## 2.0.0-beta.3
- method parseVersion renamed to getVersionFromClaimUrl
- added error handling to method getVersionFromClaimUrl

## 2.0.0-beta.2
- added method to parse link for version
- added method to define version from escrow contract

## 2.0.0-beta.1
- added optional `apiUrl` parameter
- `apiKey` parameter transformed to optional

## 2.0.0-beta.0
- added "token" parameter to getSenderHistory method
- bug fix with escrow address for old links
- operations included to ClaimLink
- apiKey hidden from properties of ClaimLink
- expiration type changed to 'number'


## 2.0.0-alpha.10
- added getSenderHistory method
- removed `void` return from public methods
- added ValidationError

## 2.0.0-alpha.9
- update for getLimits method. token argumant is not required for NATIVE tokens
- bug fix for escrow address detection

## 2.0.0-alpha.8
- updated escrow contract definition
- no native token address is needed to create NATIVE link
- added limits (min and max amount that can be used to create link)
- support for native usdc for polygon network
- updated getDepositAuthorization method

## 2.0.0-alpha.7
- updated babel configuration file

## 2.0.0-alpha.6
- expiration is now optional for initialization of ClaimLink (default: 30 days)
- added babel loader plugins
- new escrow contract addresses for base, polygon and mumbai networks

## 2.0.0-alpha.5
- switch ethers method: toQuantity => toBeHex (with bytes length)

## 2.0.0-alpha.4
- revert

## 2.0.0-alpha.3
- updated helper to prevent 0x cut in private/public key or signature

## 2.0.0-alpha.2
- removed async function for TSignTypedData type

## 2.0.0-alpha.1
- removed console logs

## 2.0.0-alpha.0
- network tokens support
- link recovery added
- short links available
- new api
- new escrow contracts

## 1.0.4
- ethers v6 added
- added initialize method to ClaimLink

## 1.0.3
- fix for baseUrl (should be passed to ClaimLink)

## 1.0.2
- minor fix with data format

## 1.0.1
- signer removed
- new methods for modules (ClaimLink, LinkdropPaySDK)
- major updates
- axios removed
- added getRandomBytes
- added signTypedData
- updates for repository name and npm package name

## 0.0.19
- added apiKey to Zuplo endpoints

## 0.0.18
- removed getDepositAmount method from Linkdrop module

## 0.0.17
- updates for getDepositAuthorization method
- new escrow contract addresses

## 0.0.16
- updates related to Base network

## 0.0.13
- added Base chain support

## 0.0.12
- added getLinkStatus method

## 0.0.11
- big fix for api url suffix

## 0.0.10
- added new api urls + new jsonrpc urls

## 0.0.9
- added update for encodeLink/decodeLink methods

## 0.0.8
- added initialization for get linkdrop method

## 0.0.7
- update for generate link method return

## 0.0.6
- update for contract address

## 0.0.5
- fix for deposit data method

## 0.0.4
- update for claim link
- polygon support added

## 0.0.3

## 0.0.2

## 0.0.1