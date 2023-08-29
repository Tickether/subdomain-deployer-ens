// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Allowlist from '@/models/allowlist'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function UPDATE(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //find address and input new mode/list
    const { address, selectedAllowlistMode, rootHash, holders } = req.body
    try {
        await connectDB()
        const allowlist = await Allowlist.findOneAndUpdate(
            { address }, 
            {mode: selectedAllowlistMode, merkle: rootHash, allowlist: holders}, 
            { new: true }
        )        
        return res.json(allowlist)
    } catch (error) {
        return res.json(error)
    }
}



