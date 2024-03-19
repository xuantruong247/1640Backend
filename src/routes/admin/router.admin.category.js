const express = require("express");
const router = express.Router();
const CategoryService = require("../../services/commons/service.category");
const { ValidationError } = require("../../utils/error-app");
const categoryService = new CategoryService();

//find All
router.get("/", async(req, res, next) => {
    try {
        const categorys = await categoryService.find();
        return res.json(categorys);
    } catch (error) {
        next(error);
    }
});

//Create
router.post("/", async(req, res, next) => {
    console.log(req.body);
    try {
        const { name, desc } = req.body

        if (!name) throw new ValidationError("Missing Text");

        const createdCategory = await categoryService.create(req.body);
        return res.json(createdCategory);
    } catch (error) {
        next(error);
    }
});


//Find One
router.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;

        const foundCategory = await categoryService.findOne(id);

        return res.json(foundCategory);
    } catch (err) {
        next(err);
    }
})


//Update
router.patch("/:id", async(req, res, next) => {
    try {
        const { name, desc } = req.body;
        const { id } = req.params;

        if (!name) throw new ValidationError("Missing Text");

        const updatedCategory = await categoryService.update(id, req.body);

        return res.json(updatedCategory);
    } catch (err) {
        next(err);
    }
});

//Delete
router.delete("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCategory = await categoryService.delete(id);
        return res.json(deletedCategory);
    } catch (err) {
        next(err);
    }
});
module.exports = router;