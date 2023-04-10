const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        // required: true
    },
    deadline_1: {
        type: Date,
        // required: true

    },
    deadline_2: {
        type: Date
    },
    closureDate: {
        type: Date

    },
    finalClosureDate: {
        type: Date
    },

}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})
const mongoosePaginate = require('mongoose-paginate-v2');
submissionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('submission', submissionSchema);







