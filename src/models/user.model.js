const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifyToken: {
        type: String,
        default: null,
    },
    emailVerifyExpiry: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
    },

    image: {
        type: String,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcryptjs.genSalt(10)
        this.password = await bcryptjs.hash(this.password, salt)
        next()
    }
    catch (err) {
        console.error(`Error while hashing Password:`, err.message);
        next(err)
    }
})

userSchema.methods.verifyPassword = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateJWT = function () {
    try {
        const token = jwt.sign({
            id: this._id,
            email: this.email,
            isAdmin: this.isAdmin
        },
            process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        return token

    }
    catch (err) {
        console.error(`Error while generating JWT Token`, err.message);
        return null
    }
}

userSchema.methods.generateEmailToken = async function () {
    try {
        const emailToken = await crypto.randomBytes(32).toString('hex');

        this.emailVerifyToken = crypto.createHash('sha256').update(emailToken).digest('hex');
        this.emailVerifyExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs

        return emailToken;
    }

    catch (err) {
        console.error(`Error while generating email verification token`);
        return null
    }
};

userSchema.methods.generateResetToken = async function () {
    try {
        const resetToken = await crypto.randomBytes(32).toString('hex');

        this.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

        return resetToken;
    }

    catch (err) {
        console.error(`Error while generating reset password token`, err.message);
        return null
    }
};


const User = mongoose.model("User", userSchema)


module.exports = User