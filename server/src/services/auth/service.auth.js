const user = require("../../models/user");
const { ValidatePassword, GenerateAccessTokenKey } = require("../../utils");
const { BadRequestError } = require("../../utils/error-app");
const UserServer = require("../commons/service.user");

const userServer = new UserServer

// const signUp = async (createData) => {
//     const createdUser = await userServer.create(createData)
//     return createdUser
// }

const signIn = async (userData) => {
    const { username, password } = userData

    const users = await userServer.findOne({ username })

    if (!users) throw new BadRequestError("Username is not Defind")

    const validatePassword = await ValidatePassword(password, users.password)

    if (!validatePassword) throw new BadRequestError('Wrong username/password')

    const accessToken = GenerateAccessTokenKey({ _id: users._id })

    return ({
        users: {
            username: users.username,
            profile: users.profile,
            address: users.address,
            role: users.role
        },
        accessToken,

    })
}

module.exports = {
    signIn,
    // signUp
}