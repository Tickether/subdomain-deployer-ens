import mongoose from "mongoose"

const AllowlistETHSchema = new mongoose.Schema({
    namehashETH: {
        type: String,
        required: true,
        unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],
    },
    modeETH: {
        type: String,
    },
    merkleETH: {
        type: String,
    },
    allowlistETH: {
        type: [String],
        //required: true,
        //unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],

    }
})

const AllowlistETH = mongoose.models.AllowlistETH || mongoose.model('AllowlistETH', AllowlistETHSchema)

export default AllowlistETH