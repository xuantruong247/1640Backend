const Submission = require("../../models/submission");
const { BadRequestError, NotFoundError } = require("../../utils/error-app");


class submissionService {
    //find all
    // async find() {
    //     const submissions = await Submission.find()
    //     return submissions
    // }
    async find(option) {
        const submissions = await Submission.paginate({}, option)
        return submissions;
    }
    //create
    async create(submission) {
        console.log(submission)
        const { name, desc, deadline_1, deadline_2 } = submission

        if (await Submission.findOne({ name })) throw new BadRequestError("Submission existed");

        const newSubmission = new Submission({
            name,
            desc,
            deadline_1,
            deadline_2
        });

        console.log(newSubmission)
        const createdSubmission = await newSubmission.save()
        console.log(createdSubmission)
        return createdSubmission
    }
    //findOne
    async findOne(id) {
        const foundSubmission = await Submission.findById(id)
        if (!foundSubmission) throw new NotFoundError("Not found submision")
        return foundSubmission

    }
    //update
    async update(id, deadline_1, deadline_2) {
        if (!(await Submission.findById(id)))
            throw new BadRequestError("Submision not existed");

        const updatedSubmission = await Submission.findByIdAndUpdate(id, deadline_1, deadline_2, { new: true });
        return updatedSubmission;
    }

    //delete
    async delete(id) {
        if (!(await Submission.findById(id)))
            throw new BadRequestError("Submision not existed");

        const deletedSubmission = await Submission.findByIdAndRemove(id);
        return deletedSubmission;
    }

}

module.exports = submissionService