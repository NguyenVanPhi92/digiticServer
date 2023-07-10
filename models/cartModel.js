const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
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
module.exports = mongoose.model('Cart', cartSchema)
