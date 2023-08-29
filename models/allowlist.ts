import mongoose from "mongoose"

const AllowlistSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],
    },
    mode: {
        type: String,
    },
    merkle: {
        type: String,
        unique: true,
    },
    allowlist: {
        type: [String],
        //required: true,
        //unique: true,
        //minLength: [42, 'address must be 42 characters'],
        //maxLength: [42, 'address must be 42 characters'],

    }
})

const Allowlist = mongoose.models.Allowlist || mongoose.model('Allowlist', AllowlistSchema)

export default Allowlist