const mongoose = require("mongoose");



const ideaSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            max: 255,
        },
        desc: {
            type: String,
        },
        content: {
            type: String,
        },
        category: {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "category",
            },
            name: String,
        },
        submission: {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "submission",
            },
            name: String,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        }
        ,
        image: { public_id: String, url: String },

        likes: [{
            likesId: {
                type: mongoose.Types.ObjectId,
                ref: 'like'
            }
        }],
        dislikes: [{
            dislikesId: {
                type: mongoose.Types.ObjectId,
                ref: 'dislike'
            }
        }],
        views: [{
            viewId: {
                type: mongoose.Types.ObjectId,
                ref: 'view'
            }
        }],

        comments: [{
            content: {
                type: String,
                max: 255,
            },
            userId: {
                type: mongoose.Types.ObjectId,
                ref: 'user'
            },
            created_at: {
                type: Date,
                default: Date.now,
            },
        }]
    },
    {
        timestamps: {
            createdAt: "created_at", // Use `created_at` to store the created date
            updatedAt: "updated_at", // and `updated_at` to store the last updated date
        },
    }
);
const mongoosePaginate = require('mongoose-paginate-v2');
ideaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("idea", ideaSchema);
