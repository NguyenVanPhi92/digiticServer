import jwt from 'jsonwebtoken'

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN, { expiresIn: '3d' })
}

export default generateRefreshToken
