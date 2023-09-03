// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistERC from '@/models/allowlisterc'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function POSTERC(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    console.log('is doing..')
    const { enshash, selectedAllowlistMode, rootHash, holders } = req.body
    console.log(enshash, selectedAllowlistMode, rootHash, holders)
    try {
        await connectDB()
        const allowlistERC = await AllowlistERC.create({ 
            namehashERC: enshash,
            modeERC: selectedAllowlistMode, // Match the property name
            merkleERC: rootHash, // Match the property name
            allowlistERC: holders, 
        })
        console.log('is done!')
        return res.json(allowlistERC)
    } catch (error) {
        return res.json(error)
    }
}
