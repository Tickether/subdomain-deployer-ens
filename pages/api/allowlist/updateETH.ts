// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistETH from '@/models/allowlisteth'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function UPDATEETH(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //find address and input new mode/list
    const { enshash, selectedAllowlistMode, rootHash, holders } = req.body
    try {
        await connectDB()
        const allowlistETH = await AllowlistETH.findOneAndUpdate(
            { namehashETH: enshash }, 
            { modeETH: selectedAllowlistMode, merkleETH: rootHash, allowlistETH: holders }, 
            { new: true }
        )        
        return res.json(allowlistETH)
    } catch (error) {
        return res.json(error)
    }
}



