import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                // liên kết id của product
                // khóa ngoại
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                count: Number,
                color: String
            }
        ],
        paymentIntent: {},
        orderStatus: {
            type: String,
            default: 'Not Processed',
            enum: [
                'Not Processed',
                'Cash on Delivery',
                'Processing',
                'Dispatched',
                'Cancelled',
                'Delivered'
            ]
        },
        orderby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true
    }
)

//Export the model
export default mongoose.model('Order', orderSchema)
