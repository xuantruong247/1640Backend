const mongoose = require('mongoose')

const dislikeSchema = mongoose.Schema({
    isDislikes: {
        type: Number
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

module.exports = mongoose.model('dislike', dislikeSchema)