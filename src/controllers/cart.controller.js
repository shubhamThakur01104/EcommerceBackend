const Cart = require("../models/cart.model")
const mongoose = require('mongoose')

const getAllCartItems = async (req, res) => {

};


const addCartItems = async (req, res) => {
    const userId = req.user.id

    const user = await Cart.create({userId})

    const cartWithUser = await Cart.aggregate([
        {
            $match:{
                "userId" : new mongoose.Schema.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo"
            }
        },
    ])

    console.log(cartWithUser);
    

};



const deleteCartItems = async (req, res) => {

}

module.exports = {
    getAllCartItems,
    addCartItems,
    deleteCartItems
}