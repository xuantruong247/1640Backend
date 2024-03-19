const express = require("express");
const router = express.Router();
const Idea = require("../../models/idea");
const { verifyToken } = require("../../middlewares/auth");
const { BadRequestError } = require("../../utils/error-app");


router.get("/views/:id", verifyToken, async (req, res, next) => {
    try {
        const ideaId = req.params.id;
        const idea = await Idea.findById(ideaId);
        if (!idea) throw new BadRequestError("idea not found");

        const user = req.user;

        const view = idea.views.find((view) => view.viewId && view.viewId.toString() === user._id.toString());


        if (view) {
            return res.status(200).send({ message: "was viewed" });
        }

        idea.views.push({ viewId: user._id });

        await idea.save();

        res.status(200).send({ message: "view saved" });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
