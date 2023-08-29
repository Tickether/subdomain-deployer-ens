// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Allowlist from '@/models/allowlist'
import connectDB from '@/utils/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function GET(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    //input address
    const { address } = req.body
    try {
        await connectDB()
        const allowlist = await Allowlist.findOne({ address })
        return res.json(allowlist)
    } catch (error) {
        return res.json(error)
    }
}
