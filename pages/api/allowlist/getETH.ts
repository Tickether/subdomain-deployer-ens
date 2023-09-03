// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import AllowlistETH from '@/models/allowlisteth'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function GETETH(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //input namehash
    const { enshash } = req.body
    try {
        await connectDB()
        const allowlistETH = await AllowlistETH.findOne({ namehashETH: enshash })
        return res.json(allowlistETH)
    } catch (error) {
        return res.json(error)
    }
}
