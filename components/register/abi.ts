export const wagmiAbi = [
    {
        name: 'setSubDomain',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" } ],
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },  
  ] as const;