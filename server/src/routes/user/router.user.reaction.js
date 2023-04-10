const express = require('express');
const router = express.Router();
const Idea = require('../../models/idea');
const { verifyToken } = require("../../middlewares/auth");
const { BadRequestError } = require('../../utils/error-app');

router.post('/like/:id', verifyToken, async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const idea = await Idea.findById(ideaId);
    if (!idea) throw new BadRequestError("idea not found");

    const user = req.user;
    console.log(user);
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

    const user = req.user;
    console.log(user);
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
    await idea.save();
    res.status(200).send({ message: "Đã like" });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
