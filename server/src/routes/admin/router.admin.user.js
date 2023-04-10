const express = require("express");
const { isAdmin, verifyToken } = require("../../middlewares/auth");
const router = express.Router();
const UserServer = require("../../services/commons/service.user");
const { ValidationError } = require("../../utils/error-app");
const userServer = new UserServer();

//Find all
router.get("/", async (req, res, next) => {
    try {
        const users = await userServer.find();
        return res.json(users);
    } catch (err) {
        next(err);
    }
});

//Create User
router.post("/", async (req, res, next) => {
    try {
        const { username, password, email, phone, role_id } = req.body;

        if (!username || !password || !role_id) throw new ValidationError("Missing Text");

        const createdUser = await userServer.create(req.body);
        return res.json(createdUser);
    } catch (err) {
        next(err);
    }
});

//Fine One
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const foundUser = await userServer.findOne({ _id: id });
        return res.json(foundUser);
    } catch (err) {
        next(err);
    }
});

//Update
router.patch("/:id", async (req, res, next) => {
    try {
        const { username, phone, email, role_id } = req.body;
        console.log(req.body);
        const { id } = req.params;

        if (!role_id) throw new ValidationError("Missing Text");

        const updatedUser = await userServer.update(id, req.body.role_id);

        return res.json(updatedUser);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;


        const deletedUser = await userServer.delete(id);
        return res.json(deletedUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;