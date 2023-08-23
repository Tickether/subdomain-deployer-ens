import { ENS } from '@/pages/[ensName]'
import styles from '@/styles/AddressModal.module.css'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useToken } from 'wagmi'
import { isAddress, namehash } from 'viem'
import { useEffect, useState } from 'react'
import wlSVG from '@/public/assets/icons/wl.svg'
import nowlSVG from '@/public/assets/icons/nowl.svg'
import clearSVG from '@/public/assets/icons/clear.svg'


interface AddressModalProps{
    ENS: ENS
    setOpenAddressModal: (openAddressModal : boolean) => void
    contract : string
  }

export default function AddressModal({ENS, setOpenAddressModal, contract} : AddressModalProps) {

  const [ERC20, setERC20] = useState<string>('');
  const [valid, setValid] = useState<boolean | null>(null);
  const [tokenName, setTokenName] = useState<string| null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  

  const prepareContractWriteAddERC20 = usePrepareContractWrite({
    address: `0x${contract.slice(2)}`,
    abi: [
      {
        name: 'addERC20',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "address", name: "addERC20", type: "address"},  ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'addERC20',
    args: [ (namehash(ENS.name)), (ERC20), ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteAddERC20 = useContractWrite(prepareContractWriteAddERC20.config)

  const waitForAddERC20 = useWaitForTransaction({
    hash: contractWriteAddERC20.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
  })

  const handleAddERC20 = async () => {
    try {
        await contractWriteAddERC20.writeAsync?.()
    } catch (err) {
        console.log(err)
    }
  }
/*
  const checkValidAddress = async (e : string) => {
    setValid(isAddress(e)) 
  }
*/
  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setERC20(clipboardText);
  };

  const getToken = useToken({
    address: `0x${ERC20.slice(2)}`,
    chainId: 5,
  })
  console.log(getToken?.data!)
  useEffect(() =>{
    if (getToken?.data!) {
      setValid(true)
      setTokenName(getToken?.data!.name)
      setTokenSymbol(getToken?.data!.symbol)
      //checkValidAddress(clipboardText)
    }
  },[getToken?.data!])

  const handleClearInput = () => {
    setERC20('')
  };  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
            <div onClick={() => setOpenAddressModal(false)} className={styles.close}>
                <Image src={closeSVG} alt='' />
            </div>
            <div className={styles.addressModal}>
              <div className={styles.addressModalTop}>
                <div>
                  <h1>Add ERC20 Token</h1>
                </div>
              </div>
              <div className={styles.addressModalMid}>
                <div className={styles.addressModalMidChild}>
                  <div className={styles.addressModalMidChildInput}>
                    <label htmlFor='addERC20'> Enter Token Address</label>
                    <input
                      required
                      placeholder='0x000000000000000000000000000000000000dEaD'
                      value={ERC20}
                      
                    />
                    {
                    ERC20.length >= 1 && (
                      <div onClick={handleClearInput} className={styles.clear}>
                        <Image  src={clearSVG} alt='' />
                      </div>
                    )
                    }
                    <button onClick={handlePaste}>paste</button>
                  </div>
                  <div className={styles.addressModalMidChildWarning}>
                    
                    {
                      valid && (
                        <div className={styles.valid}>
                            <div>
                                <Image src={wlSVG} alt='' />
                            </div>
                            <div className={styles.allowlistedInfoText}>
                                <p>{tokenName}/{tokenSymbol} is valid ERC20 Address</p>
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
                                <p>Not a valid address, Please Enter a valid ERC20 token address</p>
                            </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className={styles.addressModalDown}>
                <div>
                <button disabled={!valid} onClick={handleAddERC20}> Confirm </button>
                </div>
              </div>
            </div>
        </div>
      </div>

    </>
  )
}
