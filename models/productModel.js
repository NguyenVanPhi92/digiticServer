const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        quantity: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        images: [
            {
                public_id: {
                    type: String,
                    default:
                        'https://www.91-img.com/gallery_images_uploads/d/7/d7cf5e2b1a3a3dfcca8a8dbb524fb11a8fb1c8e8.JPG?tr=h-550,w-0,c-at_max'
                },
                url: {
                    type: String,
                    default:
                        'https://www.91-img.com/gallery_images_uploads/3/d/3df5ca6a9b470f715b085991144a5b76e70da975.JPG?tr=h-550,w-0,c-at_max'
                }
            }
        ],
        color: [],
        tags: String,
        ratings: [
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
            }
        ],
        totalrating: { type: String, default: 0 }
    },
    { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Product', productSchema)
