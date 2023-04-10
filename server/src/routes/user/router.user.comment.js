const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../middlewares/auth")
const Idea = require('../../models/idea')
const moment = require("moment-timezone")
const vnTimezone = "Asia/Ho_Chi_Minh";

const { BadRequestError } = require('../../utils/error-app')

// Route để đăng bình luận cho một ý tưởng
router.post('/comments/:id', verifyToken, async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id)
        if (!idea) throw new BadRequestError("Idea not found")
        const comment = {
            content: req.body.content,
            userId: req.user,
            created_at: moment.tz(vnTimezone).format("YYYY-MM-DDTHH:mm:ss.SSS")
            // created_at: moment.tz(vnTimezone).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        }
        console.log("comment", comment);
        idea.comments.push(comment)
        await idea.save()
        res.json(comment)
    } catch (err) {
        next(err)
    }
})


module.exports = router
