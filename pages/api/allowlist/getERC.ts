// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistERC from '@/models/allowlisterc'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function GETERC(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //input namehash
    const { enshash } = req.body
    try {
        await connectDB()
        const allowlistERC = await AllowlistERC.findOne({ namehashERC: enshash })
        return res.json(allowlistERC)
    } catch (error) {
        return res.json(error)
    }
}
