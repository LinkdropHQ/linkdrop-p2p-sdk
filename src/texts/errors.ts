import { EChains } from '../types'

export default {
  'chain_not_supported': () => `Chain is not supported. Please use ${Object.keys(EChains).filter(item => isNaN(Number(item))).join(', ')}`,
  'argument_not_provided': (argumentName: string, currentValue: string) => `Argument "${argumentName}" is not provided (argument="${argumentName}", value="${currentValue}")`,
  'property_not_provided': (propertyName: string, currentValue: string) => `Property "${propertyName}" is not provided (property="${propertyName}", value="${currentValue}")`,
  'cannot_update_amount': () => `Cannot update amount after deposit`,
  'deposit_with_auth_wrong_type': () => `You can use 'depositWithAuthorization' method only for ERC20 tokens. Use 'deposit' method instead`,
  'not_possible_create_claim_url': () => `Link should have senderSig or sender to be created`,
  'cannot_redeem_before_deposit': () => `Tokens should be deposited before redeem`,

  'link_decode_failed': () => `Link should have 'sg' (signature) or 's' (sender) param to be decoded`,
  'link_parse_failed': () => `Link should have 'sg' (signature) or 's' (sender) param to be parsed`,
  'variable_cannot_be_defined': (variable: string) => `${variable} cannot be defined`,
  'limits_not_defined': () => `Limits were not defined. Cannot create link`,
  'amount_should_be_more_than_minlimit': (minLimit: string) => `Amount should be greater than or equal to ${minLimit}`,
  'amount_should_be_less_than_maxlimit': (maxLimit: string) => `Max amount ${maxLimit}`,
  'escrow_not_available': (tokenAddress: string, chainId: number) => `Escrow contract is not available for token ${tokenAddress} (chain id: ${chainId})`,
  'escrow_is_not_correct': () => `Escrow contract address is not correct. Please check chainId and token address`,
  'version_not_found': () => 'Version not found for the provided escrow contract address',
  'version_not_provided': () => 'Version parameter "v" not found in URL',
  'cannot_deposit_after_retrieve': () => 'You cannot make a deposit again after retrieving the link',
  'cannot_deposit_twice': () => 'The deposit has already been made',
  'at_least_one_argument_not_provided': (args: string[]) => `At least one of the following arguments should be provided: ${args.join(', ')}`,
  'variable_is_not_valid': (
    variableName: string,
    expectedValueType: string,
    currentValue: any
  ) => `Variable "${variableName}" is not valid. Expected value type: ${expectedValueType}. Current value: ${currentValue}`,
  'stable_token_not_supported': (
    address: string
  ) => `Stablecoin with address not supported for depositWithAuthorization method`,
  'cannot_update_amount_for_erc721': () => `Cannot update amount for ERC721 token`,
  'limits_disabled_for_erc721_or_erc1155': () => `Cannot fetch limits for ERC1155 or ERC721 tokens`,
  'link_only_for_claim': () => 'This link can only be redeemed',
  'only_original_sender_can_generate_url': () => 'Only original sender can generate new url',
  'api_validation_error': () => 'Check the data sent to the server. The server returned an error related to data validation',
  'invalid_deployment_property': () => 'Deployment is not valid. Use LD instead or remove it'
}