import mongoose from "mongoose"

const AllowlistERCSchema = new mongoose.Schema({
    namehashERC: {
        type: String,
        required: true,
        unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],
    },
    modeERC: {
        type: String,
    },
    merkleERC: {
        type: String,
    },
    allowlistERC: {
        type: [String],
        //required: true,
        //unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],

    }
})

const AllowlistERC = mongoose.models.AllowlistERC || mongoose.model('AllowlistERC', AllowlistERCSchema)

export default AllowlistERC