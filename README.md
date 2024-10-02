# Linkdrop SDK (V3)
## Import and initialize SDK
```js
import { LinkdropSDK } from 'linkdrop-sdk'

const baseUrl = "https://p2p.linkdrop.io" // baseUrl is the host to be used to generate claim URLs. Required
// const apiKey = "spfurjdmvfkdlfo" // apiKey is the string parameter that will be passed to headers as Bearer token ("authorization" header). Not required. Default value: null
// const apiUrl = "https://api.myurl.com" // apiUrl is the string parameter that will be used as request url prefix for endpoints. Not required. Default value: https://escrow-api.linkdrop.io/v3
const getRandomBytes = (length) => { 
  return new Uint8Array(crypto.randomBytes(length));
} // To avoid using and linking native crypto libraries, we ask to pass a random bytes generation function. Required

const sdk = LinkdropSDK({
  baseUrl,
  getRandomBytes,
  // apiKey,
  // apiUrl
}) 
```

## Sender methods
### Creating claim link
**1. Initialize claim link object:**  
Learn more about the `claimLink` object in [the ClaimLink section](#claimlink-properties)

#### ERC20
```js
const from = "0x2331bca1f2de4661ed88a30c99a7a9449aa84195" // Sender's Ethereum address
const token = "0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec" // token contract address
const tokenType = "ERC20"
const chainId = 137 // network chain ID
const expiration = "1695985897077" // unix timestamp after which the claim link will expire and amount will be sent back to sender unless it was claimed before. Optional param, it not passed, it's going to be set to 15 days from now

const amount = "1000000" // atomic amount of tokens that sender wants to send (before fees)

const claimLink = await sdk.createClaimLink({
  from,
  token,
  amount,
  expiration,
  chainId,
  tokenType
})
```

#### ERC721
```js
const from = "0x2331bca1f2de4661ed88a30c99a7a9449aa84195" // Sender's Ethereum address
const token = "0x2b7ca50f95e830cd7f47f42f156a6934906e3957" // token contract address
const tokenType = "ERC721"
const chainId = 137 // network chain ID
const expiration = "1695985897077" // unix timestamp after which the claim link will expire and amount will be sent back to sender unless it was claimed before. Optional param, it not passed, it's going to be set to 15 days from now
const tokenId = '4'

const claimLink = await sdk.createClaimLink({
  from,
  token,
  expiration,
  chainId,
  tokenType,
  tokenId
})
```

#### ERC1155
```js
const from = "0x2331bca1f2de4661ed88a30c99a7a9449aa84195" // Sender's Ethereum address
const token = "0x344ed1c4387f7f18de4655a982513e22a8034bd3" // token contract address
const tokenType = "ERC1155"
const chainId = 137 // network chain ID
const expiration = "1695985897077" // unix timestamp after which the claim link will expire and amount will be sent back to sender unless it was claimed before. Optional param, it not passed, it's going to be set to 15 days from now
const tokenId = "1"
const amount = "1"

const claimLink = await sdk.createClaimLink({
  from,
  token,
  amount,
  expiration,
  chainId,
  tokenType,
  tokenId
})
```

You can update an amount for "NATIVE", "ERC20", and "ERC1155" tokens
```js
const { amount, feeAmount, totalAmount, feeToken } = await claimLink.updateAmount(amount)
```

Methods `createClaimLink` and `updateAmount` will throw an error if amount is not valid according to limits.

To define the minimum and maximum limit of amount that can be sent via link, use the getLimits method. Method is not available for ERC721 or ERC1155 tokens
```js

const token = "0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec" // token contract address. Not required if tokenType is NATIVE
const tokenType = "ERC20" // one of "NATIVE" | "ERC20" | "ERC721" | "ERC1155"
const chainId = 137 // network chain ID

const {
  minTransferAmount,
  maxTransferAmount,
  minTransferAmountUSD,
  maxTransferAmountUSD
} = await sdk.getLimits({
  token,
  tokenType,
  chainId
})

```

**2a. Deposit USDC tokens to escrow contract via EIP-3009 (transferWithAuthorization) :**  
To avoid asking for sender private key directly, we ask to pass a function that generates a EIP712 signature using Sender's private key. The function should be similar to ethers `signer.signTypedData` - https://docs.ethers.org/v6/api/providers/#Signer-signTypedData
```js

const signTypedData = (domain, types, message) => signer.signTypedData(domain, types, message)


// authConfig is optional. Use it if you need to define domain and method of authorization
const authConfig = {
  domain: { 
    // required params
    name,
    version,
    verifyingContract,

    // optional params
    chainId,
    salt
  },
  authorizationMethod // "ApproveWithAuthorization" || "ReceiveWithAuthorization"
}

const { claimUrl, transferId, txHash } = await claimLink.depositWithAuthorization({
  signTypedData,
  authConfig
}) 
```

**2b. Deposit native tokens (ETH/MATIC), ERC721, ERC1155 or ERC20 tokens to escrow contract via direct call :**  
To avoid asking for sender private key directly, we ask to pass a function that signs and sends Ethereum transaction. The function should be similar to ethers `signer.sendTransaction` - https://docs.ethers.org/v6/api/providers/#Signer-signTypedData
```js
const sendTransaction = async ({ to, value, data }) => { 
  const tx = await signer.sendTransaction({ to, value, data })
  return { hash: tx.hash }
}
const { claimUrl, transferId, txHash } = await claimLink.deposit({ sendTransaction }) 
```
For ERC20 (except USDC tokens), ERC721, and ERC1155 you need to approve tokens so that the contract has the opportunity to send them to the recipient

**3. Re-generate Claim URL:**
Sender can generate a new claim URL (if the original claim URL is lost):
```js
const { claimUrl, transferId } = await claimLink.generateClaimUrl({ signTypedData })
// share claimUrl with receiver
```
### Retrieving claim link details
This methods help to retrieve claim link details by using deposit transaction hash (or sender & transferId). 

As claim URL is never stored in database, it will be `null` on retrieval and new claim URL can be generated with `claimLink.generateClaimUrl` method call. 
```js
// fetch claim link using deposit transaction hash
const claimLink = await sdk.retrieveClaimLink({ chainId, txHash }) 

// or by using transferId
const claimLink = await sdk.retrieveClaimLink({ chainId, transferId }) 
```

### Fetching claim links created by the sender

You can also fetch information about created links
```js
const onlyActive = true // to get only active links (have not been redeemed or refunded yet) set parameter to true
const chainId = 137
const sender = '0x2331bca1f2de4661ed88a30c99a7a9449aa84195'
const limit = 10 // parameter specifies the number of claim links in response. Not required. Default: 100
const offset = 10 // parameter is used to exclude from a response the first N claim links. Not required. Default: 0
const token = "0x0000000000000000000000000000000000000000" // the parameter defines claim links related to which token address should be found. Not required. By default, the search will be performed on all token addresses

const {
  claimLinks, // claim links fetched according to search parameters
  resultSet // information about fetched data (count, offset, total)
} = await sdk.getSenderHistory({
  // required params:
  chainId,
  sender,
  // optional params:
  onlyActive, // whether to only get the claim links that haven't been redeemed/refunded yet 
  limit,
  offset,
  token
}) 
```

## Receiver methods
```js
// claim link contains all needed info to render the claim page
const claimLink = await sdk.getClaimLink(claimUrl)

// const dest = "0x123..134" // ethereum address of the receiver
const txHash = await claimLink.redeem(dest)
```

You can also define version of the link using method `getVersionFromClaimUrl`
```js
const version = sdk.getVersionFromClaimUrl(claimUrl)
```

Additionally you can use the `getVersionFromEscrowContract` method to determine the specific version of the link according to escrow contract
```js
const escrowAddress = '0x0b962bbbf101941d0d0ec1041d01668dac36647a'
const version = sdk.getVersionFromEscrowContract(escrowAddress)
```


## ClaimLink
Claim Link object contains methods and properties to facilitate both creation and redemption of the claim link. 
  
`ClaimLink.claimUrl` is the URL shared with recipient. It is never stored in a remote database, so this property is going be `null` on retrieval. New claim URL can be generated with a `claimLink.generateClaimUrl` method call if needed.  

### ClaimLink properties:
- _transferId_ (string, transfer unique id, e.g. "1695985897077")
- _tokenType_ (string, token standard type, one of `'NATIVE' | 'ERC20' | ;'ERC721' | 'ERC1155'`)
- _amount_ (string, atomic amount of tokens receiver going to claim, e.g. "1000000" for 1 USDC)
- _fee_ (string, atomic amount of tokens sender needs to pay as a fee, e.g. "100000" or 0.1 USDC)
- _expiration_ (string, unix timestamp after which the claim link will expire and amount will be sent back to sender unless it was claimed before)
- _totalAmount_ (string, total amount sender needs to deposit, _amount_ + _fee_, e.g. "1100000" or 1.1 USDC)
- _token_ (string, token contract address, e.g. "0x2791bca1f2de4661ed88a30c99a7a9449aa84174")
- _chainId_ (number, network chain ID, e.g. 147 for Polygon network)
- _sender_ (string, Sender's Ethereum address, e.g. "0x2331bca1f2de4661ed88a30c99a7a9449aa84195")
- _escrow_ (string, Escrow contract address "0x1111bca1f2de4661ed88a30c44a7a9449aa84106")
- _version_ (string, claim link version, e.g. "1")
- _claimUrl_ (string, the URL that shall be shared with recipient, e.g. `https://p2p.linkdrop.io/#/usdc?k=8uoxFBZtJZA72xHJzkdZnZoKbT15Swhn4f5z6jV8Q9U&s=JeGDRq7xAPRYhhYkXRJTXh1St97nRN2m2CQG27LzAnyEA4L4APm9GbDx6kDYEZYjmeGdJgyLpY1ap9FyPtogtG48r&i=mYfAE4p&c=137&v=1`
- _status_ (string, claim link status, one of `'created' | 'depositing' | 'deposited' | 'redeemed'| 'redeeming' | 'error' | 'refunded' | 'refunding' | 'cancelled'`)
- _operations_ (array of operations related to the claim link)

_operation_:  
 - _type_: (string, operation type, one of `'deposit' | 'redeem' | 'refund'`)
 - _timestamp_ (unix timestamp when operation was made)
 - _txHash_: (string, ethereum transaction hash corresponding to the operation)
 - _status_: (string, operation status, one of `'pending' | 'completed' | 'error'`)
 - _receiver_: (string, Receiver's Ethereum address, present only for redeem operations, e.g. "0x2331bca1f2de4661ed88a30c99a7a9449aa84195")

#### Get Claim Link Status
In order to get the latest status of the claim link, use the following method: 
```js
const { status, operations } = await claimLink.getStatus()
```


#### Get Claim Link deposit params
In order to get params that will be passed to the sendTransaction method when making a deposit, you can use the public method getDepositParams
```js
const {
  value,
  data,
  to,
} = claimLink.getDepositParams()
```



## Error handling

### Catching errors
```js

try {
  ...
  const txHash = await claimLink.redeem('')
  ...
  
} catch (err) {
  console.log(err.message)
  // Validation Error: Argument "dest" is not provided (argument="dest", value="")

  console.log(err.error)
  // DESTINATION_ADDRESS_NOT_PROVIDED
}

```

### Error types
- SENDER_NOT_PROVIDED - argument "sender" is not provided to constructor
- TOKEN_ID_NOT_PROVIDED - argument "tokenId" is not provided to constructor
- AMOUNT_NOT_PROVIDED - argument "amount" is not provided to method or constructor
- CANNOT_UPDATE_AMOUNT_FOR_ERC721 - you cannot specify the number of tokens for ERC721
- LIMITS_NOT_AVAILABLE_FOR_ERC721_AND_ERC1155 - limits are not available for ERC721 and ERC1155 tokens
- TOKEN_TYPE_NOT_PROVIDED - argument "tokenType" is not provided to constructor
- TOKEN_NOT_PROVIDED - argument "token" is not provided to method or constructor
- TRANSFER_ID_NOT_PROVIDED - argument "transferId" is not provided to constructor
- SEND_TRANSACTION_NOT_PROVIDED - function "sendTransaction" is not provided to method
- TOKEN_NOT_SUPPORTED_FOR_DEPOSIT_WITH_AUTH - current stablecoin is not supported
- SIGN_TYPED_DATA_NOT_PROVIDED - function "signTypedData" is not provided to method
- MIN_LIMIT_FAILED - you cannot specify the number of tokens less than the lower limit
- MAX_LIMIT_FAILED - you cannot specify the number of tokens greater than the upper limit
- INVALID_DEPLOYMENT_PROPERTY - you cannot specify a deployment other than CBW or LD
- BASE_URL_NOT_PROVIDED - argument "baseUrl" is not provided to constructor
- GET_RANDOM_BYTES_NOT_PROVIDED - function "signTypedData" is not provided to constructor
- CHAIN_ID_NOT_PROVIDED - argument "chainId" is not provided to constructor or method
- CHAIN_NOT_SUPPORTED - current chain is not supported. Supported chains: 137, 11155111, 8453, 84531, 43114, 10, 42161, 100
- FROM_NOT_PROVIDED - argument "from" is not provided to method
- DEPOSIT_STILL_PENDING - recipient attempts to claim tokens before the deposit transaction is completed
