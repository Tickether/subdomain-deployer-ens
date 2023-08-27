import { ENS } from '@/pages/[ensName]'
import styles from '@/styles/AllowlistModal.module.css'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import { erc20ABI, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { bytesToHex, namehash } from 'viem'
import { Network, Alchemy } from 'alchemy-sdk'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import clearSVG from '@/public/assets/icons/clear.svg'
import wlSVG from '@/public/assets/icons/wl.svg'
import nowlSVG from '@/public/assets/icons/nowl.svg'

interface AllowlistModalProps{
    ENS: ENS
    setOpenAllowlistModal: (openAllowlistModal : boolean) => void
    contract : string
  }


  
  
 
  
  
  
export default function AllowlistModal({ENS, setOpenAllowlistModal, contract} : AllowlistModalProps) {
  const [allowlistModeMenu, setAllowlistModeMenu] = useState<boolean>(false)
  const [selectedAllowlistMode, setSelectedAllowlistMode] = useState<string>('holders')
  const [subsLimit, setSubsLimit] = useState<number>(1)
  const [ERC721, setERC721] = useState<string>('');
  const [valid, setValid] = useState<boolean | null>(null);
  const [holders, setHolders] = useState<string[]>([])
  const [isLoadingHolders, setLoadingHolders] = useState<boolean>(false)
  const [rootHash, setRootHash] = useState<undefined | Buffer>(undefined)
 
  
  const handleAllowlistModeToggle =  () => {
    setAllowlistModeMenu(!allowlistModeMenu)
  }
 
  
  const prepareContractWriteAllowlist = usePrepareContractWrite({
    address: `0x${contract.slice(2)}`,
    abi: [
      {
        name: 'updateBaseEnsMerkle',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "bytes32", name: "merkleRoot", type: "bytes32"}, {internalType: "uint256", name: "numberOfSubENS", type: "uint256" } ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'updateBaseEnsMerkle',
    args: [ (namehash(ENS.name)), (bytesToHex(rootHash!)),  (subsLimit) ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteAllowlist = useContractWrite(prepareContractWriteAllowlist.config)

  const waitForSetAllowlist = useWaitForTransaction({
    hash: contractWriteAllowlist.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
  })

  const handleSetAllowlist = async () => {
    try {
        await contractWriteAllowlist.writeAsync?.()
    } catch (err) {
        console.log(err)
    }
  }
  
  const handleDecrement = () => {
    if (subsLimit <= 1) return
    setSubsLimit(subsLimit - 1 );
  };

  const handleIncrement = () => {
      setSubsLimit(subsLimit + 1)
  };

  // get list of address and gen merkle root and store when handleSet Allowlist
  
  useEffect(()=>{
    const getHolders = async () => {
      if (ERC721.length >=1) {
        const settings = {
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
          network: Network.ETH_MAINNET,
        };
        const alchemy = new Alchemy(settings);
        try {
          setLoadingHolders(true)
          // Print total NFT collection returned in the response:
          const res = (await alchemy.nft.getOwnersForContract(ERC721)).owners
          if (res.length >= 1) {
            setHolders(res)
            setValid(true)
          } else {
            setValid(false)
          }
          
        } catch (error) {
          setValid(false)
        }
      } else {
        setHolders([])
        setValid(false) 
        setRootHash(undefined)
      }
    }
    getHolders()
  },[ERC721])

  useEffect(()=>{
    if (holders.length >= 1) {
      let leafNodes = holders.map(addr => keccak256((addr)));
      let merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
      const root = merkleTree.getRoot();
      setRootHash(root)
      setLoadingHolders(true)
    }
  },[holders])
  console.log(holders)
  console.log(rootHash)
  console.log(bytesToHex(rootHash!))



  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setERC721(clipboardText);
  };


  const handleClearInput = () => {
    setERC721('')
  };  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
            <div onClick={() => setOpenAllowlistModal(false)} className={styles.close}>
                <Image src={closeSVG} alt='' />
            </div>
            <div className={styles.allowlistModal}>
              <div className={styles.allowlistModalTop}>
                  <div>
                    <h1>Set Allowlist</h1>
                  </div>
                  <div onClick={handleAllowlistModeToggle} className={styles.allowlistModalTopOption}>
                    { selectedAllowlistMode === 'holders' && <p>Collection Holders</p>}
                    { selectedAllowlistMode === 'personal' && <p>Personally Curated</p>}
                    <Image src={drop_blueSVG} alt='' />
                  </div>
                  <div className={styles.dropOverlay}>
                    {
                      allowlistModeMenu && (
                        <div className={styles.allowlistModalTopOptionDrop}>
                          <div className={styles.allowlistModalTopOptionDropToggle}>
                            <div
                              onClick={()=> {
                                setSelectedAllowlistMode('holders'); 
                                setAllowlistModeMenu(false);
                              }}
                              className={styles.allowlistModalTopOptionDropToggleSpan}
                            >
                              <span>Collection Holders</span>
                            </div>
                            
                            <div 
                              onClick={()=> {
                                setSelectedAllowlistMode('personal'); 
                                setAllowlistModeMenu(false);
                              }}
                              className={styles.allowlistModalTopOptionDropToggleSpan}
                            >
                              <span>Personally Curated</span>
                            </div>
                            
                          </div>
                        </div>
                      )
                    }
                  </div>
              </div>
              <div className={styles.allowlistModalMid}>
              { selectedAllowlistMode === 'holders' && (
                <div className={styles.allowlistModalMidChild}>
                  <div className={styles.allowlistModalMidChildInput}>
                    <label htmlFor='addERC721'> Enter Token Address</label>
                    <input
                      required
                      placeholder='0x000000000000000000000000000000000000dEaD'
                      value={ERC721}
                    />
                    {
                    ERC721.length >= 1 && (
                      <div onClick={handleClearInput} className={styles.clear}>
                        <Image  src={clearSVG} alt='' />
                      </div>
                    )
                    }
                    <button disabled={ERC721.length >= 1} onClick={handlePaste}>paste</button>
                  </div>
                  <div className={styles.allowlistModalMidChildWarning}>
                    
                    {
                      valid && (
                        <div className={styles.valid}>
                            <div>
                                <Image src={wlSVG} alt='' />
                            </div>
                            <div className={styles.allowlistedInfoText}>
                                <p> Valid Address. The allowlist is ready to be set!</p>
                            </div>
                        </div>
                      )
                    }
                    {
                      !valid  && (
                        <div className={styles.invalid}>
                            <div>
                                <Image src={nowlSVG} alt='' />
                            </div>
                            <div className={styles.allowlistedInfoText}>
                                <p>Enter a valid ERC721/ERC115 address, to generate the Allowlist.</p>
                            </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              )}
              { selectedAllowlistMode === 'persnoal' && (
                <div className={styles.allowlistModalMidChild}>
                  
                </div>
              )}
              </div>
              <div className={styles.allowlistModalDown}>
                <div>
                  { selectedAllowlistMode === 'holders' && <button disabled={ERC721 == '' || rootHash == undefined || isLoadingHolders} onClick={handleSetAllowlist}> Confirm </button>}
                  { selectedAllowlistMode === 'persnoal' && <button> Confirm </button>}
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}
