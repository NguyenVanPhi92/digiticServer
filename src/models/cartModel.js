import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                // liên kết id của product
                // khóa ngoại
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                count: Number,
                color: String,
                price: Number
            }
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        // liên kết id của User
        // khóa ngoại
        orderby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true
    }
)

//Export the model
export default mongoose.model('Cart', cartSchema)
