const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database is connected successfully on ${connection.connection.host}`);

        return connection

    }
    catch (err) {
        console.error('Error while connecting with Data base', err.message)
        process.exit(1)
    }
}

module.exports = dbConnection