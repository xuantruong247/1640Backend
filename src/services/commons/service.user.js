const User = require("../../models/user");
const { BadRequestError, NotFoundError } = require("../../utils/error-app");
const RoleService = require("./service.role");
const { HashPassword } = require("../../utils");
const roleService = new RoleService();

class UserServer {
    async find() {
        const users = await User.find();
        return users;
    }

    async findOne(conditions, selections) {
        const foundUser = await User.findOne(conditions, selections);
        if (!foundUser) throw new NotFoundError("Not found user");
        return foundUser;
    }


    async create(user) {
        const { username, password, first_name, last_name, email, phone, role_id } = user;

        if (await User.findOne({ username }))
            throw new BadRequestError("User existed");

        const foundRole = await roleService.findOne(role_id);
        const hashPassword = await HashPassword(password)

        const newUser = new User({
            username,
            password: hashPassword,
            profile: {
                email,
                phone,
            },
            role: {
                id: foundRole._id,
                name: foundRole.name,
            },
        });

        const createUser = await newUser.save();
        return createUser;
    }

    async update(id, role_id) {
        //kiem tra role neu khong ton tai thi ra loi
        const foundUser = await User.findById(id)
        if (!foundUser)
            throw new BadRequestError("User not existed");

        const role = await roleService.findOne(role_id)

        const updatedUser = await User.findOneAndUpdate({_id: id}, {role: {id: role._id, name: role.name}}, {
            new: true,
        });
        console.log(updatedUser)
        return updatedUser;
    }

    async delete(id) {
        if (!(await User.findById(id)))
            throw new BadRequestError("User not existed");
        const deletedUser = await User.findByIdAndRemove(id);
        return deletedUser;
    }
}

module.exports = UserServer;
