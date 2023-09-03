// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistETH from '@/models/allowlisteth'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function POSTETH(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    console.log('is doing..')
    const { enshash, selectedAllowlistMode, rootHash, holders } = req.body
    console.log(enshash, selectedAllowlistMode, rootHash, holders)
    try {
        await connectDB()
        const allowlistETH = await AllowlistETH.create({ 
            namehashETH: enshash,
            modeETH: selectedAllowlistMode, // Match the property name
            merkleETH: rootHash, // Match the property name
            allowlistETH: holders, 
        })
        console.log('is done!')
        return res.json(allowlistETH)
    } catch (error) {
        return res.json(error)
    }
}
