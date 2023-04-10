const Idea = require("../../models/idea");
const {
    BadRequestError,
    NotFoundError,
    ValidationError,
} = require("../../utils/error-app");

const CategoryService = require("../../services/commons/service.category");
const categoryService = new CategoryService();

const UserService = require("../../services/commons/service.user");
const userService = new UserService();

const SubmissionService = require("../../services/commons/service.submission");
const cloudinary = require("../../utils/cloudinary");
const { log } = require("winston");
const submissionService = new SubmissionService();

class IdeaService {
    // find all
    async find(option) {
        const ideas = await Idea.paginate({}, option)
        return ideas;
    }

    //create
    async create(info, userId, avatar) {
        //body binh thuong thi k can nhung multipart thi phai can
        const { title, desc, content, category_id, submission_id } =
            JSON.parse(info);
        if (!title || !submission_id || !category_id)
            throw new ValidationError("Missting Text");
        //avâtr nay dell file la byte[] hay string
        try {
            
            if (await Idea.findOne({ title }))
                throw new BadRequestError("Title existed");
                
            const foundCategory = await categoryService.findOne(category_id);

            const foundSubmission = await submissionService.findOne(submission_id);

            //can truyen vao 1 cai object
            const foundUser = await userService.findOne({ _id: userId });
            
            const result = await cloudinary(avatar.path);

            const newIdea = new Idea({
                title,
                desc,
                content,
                category: {
                    id: foundCategory._id,
                    name: foundCategory.name,
                },
                submission: {
                    id: foundSubmission._id,
                    name: foundSubmission.name,
                },

    
                user: foundUser._id,
                image: {
                    public_id: result.public_id,
                    url: result.url,
                },
            });

            const createIdea = await newIdea.save();
            return createIdea;
        } catch (err) {
            console.log(err);
            return null
        }
    }

    //fine One
    async findOne(id) {
        const foundIdea = await Idea.findOne(id);
        if (!foundIdea) throw NotFoundError("Not found idea");
        return foundIdea;
    }

    //update
    async update(id, views) {
        if (!(await Idea.findById(id)))
            throw new BadRequestError("Idea not existed");

        const updatedIdea = await Idea.findByIdAndUpdate(id, views, { new: true });
        return updatedIdea;
    }

    //delete
    async delete(id) {
        if (!(await Idea.findById(id)))
            throw new BadRequestError("Idea not existed");
        const deletedidea = await Idea.findByIdAndRemove(id);
        return deletedidea;
    }
}

module.exports = IdeaService;
