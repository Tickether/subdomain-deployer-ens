// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Allowlist from '@/models/allowlist'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    console.log('is doing..')
    const { address, selectedAllowlistMode, rootHash, holders } = req.body
    console.log(address, selectedAllowlistMode, rootHash, holders)
    try {
        await connectDB()
        const allowlist = await Allowlist.create({ 
            address,
            mode: selectedAllowlistMode, // Match the property name
            merkle: rootHash, // Match the property name
            allowlist: holders, 
        })
        console.log('is done!')
        return res.json(allowlist)
    } catch (error) {
        return res.json(error)
    }
}
