import mongoose from 'mongoose'

const dbConnect = () => {
    try {
        const conn = mongoose.connect(
            'mongodb+srv://patrickDev:4YZhfjLLoq0jUtWn@cluster0.kuzft.mongodb.net/digitic?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log('Database Connected Successfully')
    } catch (error) {
        console.log('Database error')
    }
}

// export file
export default dbConnect
