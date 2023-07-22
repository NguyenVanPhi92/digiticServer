import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        numViews: { type: Number, default: 0 },
        isLiked: { type: Boolean, default: false },
        isDisliked: { type: Boolean, default: false },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        author: { type: String, default: 'Admin' },
        images: {
            type: String,
            default:
                'https://freepngimg.com/thumb/blogging/5-2-blogging-free-download-png-thumb.png'
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
)

//Export the model
export default mongoose.model('Blog', blogSchema)
