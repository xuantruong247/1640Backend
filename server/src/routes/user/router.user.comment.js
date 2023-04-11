const express = require('express')
const router = express.Router()
const { verifyToken } = require("../../middlewares/auth")
const Idea = require('../../models/idea')
const moment = require("moment-timezone")
const vnTimezone = "Asia/Ho_Chi_Minh";
const nodemailer = require("nodemailer")
const User = require("../../models/user")



const { BadRequestError } = require('../../utils/error-app')

// Route để đăng bình luận cho một ý tưởng
router.post('/comments/:id', verifyToken, async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id)
        if (!idea) throw new BadRequestError("Idea not found")


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "truongnxgcs190087@fpt.edu.vn",
                pass: "dqmnztbuigyetsov"
            }
        })

        const user = await User.findOne({ _id: req.user._id });
        const userEmail = user.profile.email;

        const comment = {
            content: req.body.content,
            userId: user._id,
            created_at: moment.tz(vnTimezone).format("YYYY-MM-DDTHH:mm:ss.SSS")

        }
        console.log("comment", comment);

        // send email
        const mailOption = {
            from: "truongnxgcs190087@fpt.edu.vn",
            to: userEmail,

            subject: "Thông báo: Bạn vừa comment 1 nội dung",
            text: "Bạn vừa comment một nội dung ở web demo của chúng tôi."
        }
        transporter.sendMail(mailOption, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log("Email sent comment: " + info.response);
            }
        })

        idea.comments.push(comment)
        await idea.save()
        res.json(comment)
    } catch (err) {
        next(err)
    }
})


module.exports = router
