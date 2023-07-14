const Product = require('../models/productModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const validateMongoDbId = require('../utils/validateMongodbId')
const { cloudinaryUploadImg } = require('../utils/cloudinary')

//crate new product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// update one product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params // lay id tu params
    validateMongoDbId(id) // xac thuc id cos hop le hay khong
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// detele one product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params
    validateMongoDbId(id)
    try {
        const deleteProduct = await Product.findOneAndDelete(id)
        res.json({ message: 'Delete product success' })
    } catch (error) {
        throw new Error(error)
    }
})

// get one product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// get all product
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        /**
         * Filter khoang gia
         * Filter cac filed du lieu
         */
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        // lay ra cac san phan sau khi loc
        let query = Product.find(JSON.parse(queryStr))

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // limiting the fields
        if (req.query.fields) {
            // lay ra cac filed data product
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            // lay ra all product loai tru 1 so field data
            query = query.select('-__v')
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        console.log('paginations ', page, limit, skip)
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount) throw new Error('This Page does not exists')
        }
        const product = await query
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

// add product ro wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user // lấy ra ID của user đã login
    const { prodId } = req.body // lay ra id cua product
    try {
        const user = await User.findById(_id) // tìm user tại ID
        // tìm xem id của sản phẩm đã có trong wishlist chưa
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyadded) {
            // nếu đã có rồi thì xõa khỏi wishlist
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        } else {
            // chưa có thì add vào wishlist
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})

// Đánh giá product
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user // Lấy ra Id user đã login
    const { star, prodId, comment } = req.body // Lấy ra các đánh giá của user
    try {
        const product = await Product.findById(prodId)
        // Tìm xem sản phẩm đã đc User đánh giá hay chưa
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        )
        // Nếu đã đánh giá...
        if (alreadyRated) {
            //... update lại đánh giá củ
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                // set lại filed ratings
                {
                    $set: { 'ratings.$.star': star, 'ratings.$.comment': comment }
                },
                {
                    new: true
                }
            )
            // Chưa đánh giá ...
        } else {
            //... thêm đánh giá mới
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        }
                    }
                },
                {
                    new: true
                }
            )
        }
        /**
         * Sau khi đánh giá sản phẩm...
         * 1 Tìm ra sản phẩm đã đc đánh giá
         * 2 Tính tổng trung bình đánh giá
         * 3 Trả về sản phẩm đc đánh giá
         */
        const getallratings = await Product.findById(prodId)
        // Tổng có bao nhiêu lượt đánh giá
        let totalRating = getallratings.ratings.length
        // Tổng đánh giá
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0)
        // Trung bình đánh giá
        let actualRating = Math.round(ratingsum / totalRating)

        // Trả về sản phẩm kiềm các review
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating
            },
            { new: true }
        )
        res.json(finalproduct)
    } catch (error) {
        throw new Error(error)
    }
})

// upload Image cho Product
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files
        console.log('hihi ', req)
        for (const file of files) {
            const { path } = file
            const newpath = await uploader(path)
            urls.push(newpath)
        }

        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file
                })
            },
            {
                new: true
            }
        )

        res.json(findProduct)
    } catch (error) {
        throw Error(error)
    }
})

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
}
