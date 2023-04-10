const express = require("express");
const router = express.Router();
const { ValidationError } = require("../../utils/error-app");
const IdeaService = require("../../services/commons/service.idea");
const { verifyToken } = require("../../middlewares/auth");
const ideaService = new IdeaService();
const multer = require('multer');
const idea = require("../../models/idea");
const mongoose = require("mongoose");
const upload = multer({ dest: 'uploads/' });



//find all 
router.get("/", async (req, res, next) => {
    try {
        const ideas = await ideaService.find(req.query)
        return res.json(ideas)
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async (req, res, next) => {
    const id = req.params.id
    // console.log(id);
    try {
        const objectId = new mongoose.Types.ObjectId(id);
        const ideas = await idea.find({ "submission.id": objectId })
        
        console.log(ideas);
        return res.json(ideas)
    } catch (error) {
        next(error)
    }
})

//create
router.post("/", upload.single('avatar'), verifyToken, async (req, res, next) => {
    try {
        const avatar = req.file
        const userId = req.user._id

        const createdIdea = await ideaService.create(req.body.info, userId, avatar)
        if (createdIdea)
            return res.json(createdIdea)
        else
            return res.status(500).json({ success: false, error: "Something went wrong !" })
    } catch (error) {
        next(error)
    }

})

module.exports = router;
