Node 16.16.0 npm 9.8.0
Express + Mongoose + bcrypt + cloudinary + nodemailer

11 bang Database, 72 API
Xay theo mo hinh MVC, Middleware, Authencation, Author
ERD: https://drawsql.app/teams/phipinto/diagrams/ecommerce

-   bcategories
-   blogs
-   brands
-   carts
-   colors
-   coupons
-   orders
-   pcategories
-   products
-   users
-   enquiry: form nhan thoong tin gop y cuaa khach hang

-   Feature:
-   User: register, updated, delete User, get one User, get all User,logout, saveAddress, updatePassword, forgotPasswordToken,resetPassword, getWishlist, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, getOrderByUserId,blockUser, unblockUser 25 API
-   Admin: updateOrderStatus, getAllOrders
-   Product: create, update, delete, getAProduct, get All Product, add product to wishlist, rating product
-   Blog: create, update, get a blog, get all blog, delete blog, like blog, dislike blog
-   Categories: create, get one, get all, update, delete
-   Blog Categooy: create, get one, get all, update, delete
-   Brand: create, get one, get all, update, delete
-   Coupon: create, get one, get all, update, delete
-   UploadImage: dung cloudinary, npm i multer sharp cloudinary
