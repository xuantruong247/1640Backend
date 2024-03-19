const express = require("express");
const router = express.Router();
const { ValidationError } = require("../../utils/error-app");
const { verifyToken } = require("../../middlewares/auth");

const IdeaService = require("../../services/commons/service.idea");
const ideaService = new IdeaService();


//find all 
router.get("/", async (req, res, next) => {
    try {
        const ideas = await ideaService.find()
        return res.json(ideas)
    } catch (error) {
        next(error)
    }
})

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


//create admin 
// router.post("/", upload.single('avatar'), verifyToken, async (req, res, next) => {
//     //req.file
//     //req.body.info

//     try {
//         const avatar = req.file
//         const userId = req.user._id

//         // const createdIdea = await ideaService.create(req.user, req.body)
//         const createdIdea = await ideaService.create(req.body.info, userId, avatar)
//         if (createdIdea)
//             return res.json(createdIdea)
//         else
//             return res.status(500).json({ success: false, error: "Something went wrong !" })
//     } catch (error) {
//         next(error)
//     }

// })


// fine One
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const foundIdea = await ideaService.findOne({ _id: id })
        return res.json(foundIdea)
    } catch (error) {
        next(error)
    }
})



// update 
router.patch("/:id", async (req, res, next) => {
    try {
        const { views } = req.body
        const { id } = req.params

        if (!views) throw new ValidationError("Missing Text");

        const updatedIdea = await ideaService.update(id, req.body)
        return res.json(updatedIdea)

    } catch (error) {
        next(error)
    }
})


//delete 
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params

        const deletedIdea = await ideaService.delete(id)
        return res.json(deletedIdea)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
