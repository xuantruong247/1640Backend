const express = require('express');
const router = express.Router();
const Idea = require('../../models/idea');
const { verifyToken } = require("../../middlewares/auth");
const { BadRequestError } = require('../../utils/error-app');
const nodemailer = require("nodemailer")
const User = require("../../models/user")

router.post('/like/:id', verifyToken, async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const idea = await Idea.findById(ideaId);
    if (!idea) throw new BadRequestError("idea not found");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "truongnxgcs190087@fpt.edu.vn",
        pass: "dqmnztbuigyetsov"
      }
    })

    const user = await User.findOne({ _id: req.user._id });
    const userEmail = user.profile.email;


    console.log(userEmail);
    const like = idea.likes.find((like) => like.likesId && like.likesId.toString() === user._id.toString());

    const dislike = idea.dislikes.find((dislike) => dislike.dislikesId && dislike.dislikesId.toString() === user._id.toString())

    if (like) {
      idea.likes.pull({ likesId: user._id });
      await idea.save();
      return res.status(200).send({ message: "Đã unlike" });
    } else if (dislike) {
      idea.dislikes.pull({ dislikesId: user._id });
      idea.likes.push({ likesId: user._id });
      await idea.save();
      return res.status(200).send({ message: "Đã dislike và chuyển sang like" });
    }
    idea.likes.push({ likesId: user._id });
    // send email
    const mailOption = {
      from: "truongnxgcs190087@fpt.edu.vn",
      to: userEmail,

      subject: "Thông báo: Bạn vừa like 1 nội dung",
      text: "Bạn vừa like một nội dung ở web demo của chúng tôi."
    }
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent like: " + info.response);
      }
    })
    await idea.save();
    res.status(200).send({ message: "Đã like" });

  } catch (err) {
    next(err);
  }
});



router.post('/dislike/:id', verifyToken, async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const idea = await Idea.findById(ideaId);
    if (!idea) throw new BadRequestError("idea not found");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "truongnxgcs190087@fpt.edu.vn",
        pass: "dqmnztbuigyetsov"
      }
    })
    const user = await User.findOne({ _id: req.user._id });
    const userEmail = user.profile.email;
    const like = idea.likes.find((like) => like.likesId && like.likesId.toString() === user._id.toString());

    const dislike = idea.dislikes.find((dislike) => dislike.dislikesId && dislike.dislikesId.toString() === user._id.toString())

    if (dislike) {
      idea.dislikes.pull({ dislikesId: user._id });
      await idea.save();
      return res.status(200).send({ message: "Đã unlike" });
    } else if (like) {
      idea.likes.pull({ likesId: user._id });
      idea.dislikes.push({ dislikesId: user._id });
      await idea.save();
      return res.status(200).send({ message: "Đã like và chuyển sang dislike" });
    }
    idea.dislikes.push({ dislikesId: user._id });
    // send email
    const mailOption = {
      from: "truongnxgcs190087@fpt.edu.vn",
      to: userEmail,

      subject: "Thông báo: Bạn vừa dislike 1 nội dung",
      text: "Bạn vừa dislike một nội dung ở web demo của chúng tôi."
    }
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent dislike: " + info.response);
      }
    })
    await idea.save();
    res.status(200).send({ message: "Đã like" });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
