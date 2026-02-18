const UserModel = require('../model/user.model')

const UserController = {
    async loadUsers() {
        return await UserModel.findAll()
    },
    async findById(id) {
        return await UserModel.findById(id)
    },
    async deleteById(id) {
        return await UserModel.deleteById(id)
    }
}

module.exports = UserController