Node 16.16.0 npm 9.8.0
Express + Mongoose + bcrypt + cloudinary + nodemailer
Using Syntax ES6 module

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
-   enquiry: form nhận thông tin của khách hàng

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

        "bcrypt": mã hóa password,
        "body-parser": chuyển body sang json từ client,
        "cloudinary": lưu image lên cloudinary,
        "cookie-parser": là một middleware trong Node.js được sử dụng để xử lý và phân tích chuỗi cookie trong yêu cầu HTTP,
        "cors":  "Cross-Origin Resource Sharing" (Chia sẻ tài nguyên giữa các nguồn gốc khác nhau). Đây là một chính sách bảo mật được thực thi trên các trình duyệt web để giới hạn sự truy cập từ các nguồn (origin) khác nhau đến tài nguyên của một trang web
        Khi một trang web yêu cầu tải tài nguyên từ một nguồn (domain) khác với nguồn gốc của trang, trình duyệt áp dụng cơ chế Same-Origin Policy (Chính sách cùng nguồn gốc). Điều này đơn giản là trình duyệt chỉ cho phép các yêu cầu tải tài nguyên từ cùng một nguồn gốc (protocol, domain, và port) mà trang web đã được tải từ. Nếu yêu cầu tới một nguồn khác, trình duyệt sẽ chặn yêu cầu đó, và đây được gọi là chặn "same-origin" request.
        Để cho phép các yêu cầu tới các nguồn khác và chia sẻ tài nguyên giữa các nguồn, bạn cần thiết lập và cho phép CORS trên máy chủ. Điều này đòi hỏi máy chủ phải trả về các tiêu đề phù hợp (CORS headers) trong các phản hồi HTTP của nó.
        CORS headers bao gồm:
        Access-Control-Allow-Origin: Tiêu đề này chỉ ra các nguồn gốc được phép gửi yêu cầu tới máy chủ. Nếu giá trị là "\*" (asterisk), máy chủ cho phép mọi nguồn gốc. Nếu là một giá trị cụ thể (ví dụ: "https://example.com"), máy chủ chỉ cho phép yêu cầu từ nguồn đó.
        Access-Control-Allow-Methods: Tiêu đề này chỉ ra các phương thức HTTP được phép khi gửi yêu cầu tới máy chủ.
        Access-Control-Allow-Headers: Tiêu đề này chỉ ra các tiêu đề yêu cầu (request headers) được phép.
        Access-Control-Allow-Credentials: Nếu giá trị là "true", cho phép gửi yêu cầu với thông tin xác thực (credentials) như cookies hoặc HTTP authentication.
        Access-Control-Expose-Headers: Tiêu đề này chỉ ra các tiêu đề phản hồi (response headers) mà trình duyệt cho phép tài nguyên JavaScript truy cập.
        "dotenv": tạo biến môi trường,
        "express": framework viết API,
        "express-async-handler": middleware xử lý handle,
        "jsonwebtoken": tạo token,
        "mongoose": ,
        "morgan": in các request API khi thực hiện,
        "multer": middleware upload file từ form trong ứng dụng web.,
        "nodemailer": gửi email,
        "sharp": thư viện này cho phép bạn thực hiện các thao tác xử lý hình ảnh như điều chỉnh kích thước, cắt, chuyển đổi định dạng, và xử lý các hình ảnh nhanh chóng và hiệu quả.,
        "slugify": tạo slug vd: product-1-7hwh82-ư8r23h,
        "uniqid": tạo id duy nhất

BUG: login logout cần xem lại cách thức hoạt động
1: user login tạo 1 token -> lấy ra token đó refresh token mới tạo phiên đăng nhập lưu token vào cookie -> logout lấy ra token trong cookie delete
