const express = require("express");
const { signIn } = require("../../services/auth/service.auth");
const router = express.Router();

router.post("/signIn", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) throw new ValidationError("Missing Text");

        const data = await signIn(req.body);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// router.post("/getUser", v async (req, res, next) => {
//     try {
//         const 
//     }
// })

module.exports = router;