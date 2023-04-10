const mongoose = require('mongoose')

const LikeSechema = mongoose.Schema({
    isLikes: {
        type: Boolean
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

module.exports = mongoose.model('like', LikeSechema)