// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistERC from '@/models/allowlisterc'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function UPDATEERC(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //find address and input new mode/list
    const { enshash, selectedAllowlistMode, rootHash, holders } = req.body
    try {
        await connectDB()
        const allowlistERC = await AllowlistERC.findOneAndUpdate(
            { namehashERC: enshash }, 
            { modeERC: selectedAllowlistMode, merkleERC: rootHash, allowlistERC: holders }, 
            { new: true }
        )        
        return res.json(allowlistERC)
    } catch (error) {
        return res.json(error)
    }
}



