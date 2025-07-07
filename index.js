const express = require('express')
const dotenv = require('dotenv')
const dbConnection = require('./src/config/dbConnection')
const userRoute = require('./src/routes/auth.routes')
const apiRoute = require('./src/routes/product.routes')
const productRoute = require('./src/routes/admin.routes')
const cartRoute = require('./src/routes/cart.routes')
const cors = require('cors')

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const startServer = async () => {
    try {
        await dbConnection()

        app.use('/user', userRoute)
        app.use('/api', apiRoute)
        app.use('/admin', productRoute)
        app.use('/cart', cartRoute)

        app.listen(PORT, () => {
            console.log(`Server is successfully running on PORT : ${PORT}`);

        })
    }
    catch (err) {
        console.error(`Server failed to start`, err.message);
        process.exit(1)
    }
}

startServer()