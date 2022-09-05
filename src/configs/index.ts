type TContracts = Record<string | number, {
    factory: string;
    claimHost: string;
    apiHost: string;
}>

const contracts: TContracts = {
  1: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    claimHost: 'https://v1-2.claim.linkdrop.io',
    apiHost: 'https://mainnet-v1-1.linkdrop.io'
  }, // mainnet
  137: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    claimHost: 'https://v1-2.claim.linkdrop.io',
    apiHost: 'https://matic-v1-1.linkdrop.io'
  }
}

export default contracts