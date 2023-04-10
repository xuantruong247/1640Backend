const express = require('express')
const bodyParser = require("body-parser")
const { PORT } = require('./config');
const { connectDatabase } = require('./database');
const ErrorHandler = require('./middlewares/error-handler')
const cors = require("cors")
const cloudinary = require("./utils/cloudinary")
const JSZip = require("jszip")
const fs = require("fs")
const cookieParser = require("cookie-parser")



//Admin 
const adminUserRouter = require('./routes/admin/router.admin.user')
const adminRoleRouter = require('./routes/admin/router.admin.role')
const adminCategoryRouter = require("./routes/admin/router.admin.category")
const adminDepartmentRouter = require("./routes/admin/router.admin.department")
const adminSubmissionRouter = require("./routes/admin/router.admin.submission")
const adminIdeaRouter = require("./routes/admin/router.admin.idea")
const authRouter = require("./routes/auth/router.auth")


//User 
const userIdeaRouter = require("./routes/user/router.user.idea");
const reaction = require("./routes/user/router.user.reaction")
const view = require("./routes/user/router.user.view")
const comment = require("./routes/user/router.user.comment")


const START_APP = async () => {
    const app = express();

    await connectDatabase()

    app.use(express.json({ limit: "25mb" }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cors())
    app.use(bodyParser.json())
    app.use(cookieParser())

    //auth
    app.use('/auth', authRouter)
    app.use('/auth', reaction)
    app.use('/auth', view)
    app.use('/auth', comment)

    // admin
    app.use('/admin/user', adminUserRouter)
    app.use('/admin/role', adminRoleRouter)
    app.use('/admin/category', adminCategoryRouter)
    app.use('/admin/department', adminDepartmentRouter)
    app.use('/admin/submission', adminSubmissionRouter)
    app.use('/admin/idea', adminIdeaRouter)

    app.use('/user/idea', userIdeaRouter)

    app.use(ErrorHandler)

    app.post("/uploadImage", (req, res) => {
        cloudinary(req.body.image)
            .then((url) => {
                res.send(url)
            })
            .catch((err) => {
                res.status(400).send(err)
            })
    })

    const port = PORT || 9999


    app.get('/export-zip', async (req, res, next) => {
        try {
            const zip = new JSZip()

            //thêm file vào trong zip
            const file1Content = "Nội dung file 1";
            zip.file("file1.txt", file1Content)


            // tạo file zip và ghi vào response
            zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
                .pipe(fs.createWriteStream("example.zip"))
                .on("finish", function () {
                    res.download("example.zip")
                })

        } catch (error) {
            next(error)
        }
    })

    app.listen(port, () => {
        console.log(`Server run in port: ${port}`)
    })
}

START_APP()