import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUD_DR_NAME,
    api_key: process.env.CLOUD_DR_API_KEY,
    api_secret: process.env.CLOUD_DR_API_SECRET_KEY
})

// upload Image
export const cloudinaryUploadImg = async (fileToUploads) => {
    console.log('fileToUploads ', fileToUploads)
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id
                },
                {
                    resource_type: 'auto'
                }
            )
        })
    })
}

// Xoa Image
export const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id
                },
                {
                    resource_type: 'auto'
                }
            )
        })
    })
}
