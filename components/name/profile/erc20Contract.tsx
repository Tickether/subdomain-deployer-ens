import styles from '@/styles/ProfileOptions.module.css'
import { useEffect, useState } from 'react'
import { useToken } from 'wagmi'


interface ERC20Props{
  erc20Contract : string
  selectERC20 : (ERC20Contract : string, ERC20Symbol: string, ERC20Decimal: number) => void;
}
//


export default function ERC20Contract({erc20Contract, selectERC20}: ERC20Props) {

    const [tokenName, setTokenName] = useState<string| null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
    const [tokenDecimal, setTokenDecimal] = useState<number | null>(null);


    const getToken = useToken({
        address: `0x${erc20Contract.slice(2)}`,
        chainId: 5,
      })
      console.log(getToken?.data!)
      useEffect(() =>{
        if (getToken?.data!) {
          setTokenName(getToken?.data!.name)
          setTokenSymbol(getToken?.data!.symbol)
          setTokenDecimal(getToken?.data!.decimals)
        }
      },[getToken?.data!])
    return (
        <>       
            <div 
                onClick={()=> {
                  selectERC20(erc20Contract, tokenSymbol!, tokenDecimal!);
                }}
                className={styles.profileDownOptionToggleSpan}
            >
                <span>{tokenName}</span>
                <span>{tokenSymbol}</span>
                <span>{erc20Contract}</span>
            </div>
        </>
    )
}
