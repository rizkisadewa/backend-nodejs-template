import database from '../models';

class UserTypeService {
    static async getAllUserTypes() {
        try {
            return await database.user_type.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addUserType(newUserType) {
        try {
            return await database.user_type.create(newUserType);
        } catch (error) {
            throw error;
        }
    }

    static async updateUserType(id, updateUserType) {
        try {
            const UserTypeToUpdate = await database.user_type.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (UserTypeToUpdate) {
                return await UserTypeToUpdate.update(updateUserType);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getUserType(id) {
        try {
            const UserType = await database.user_type.findOne({
                where: {
                    id: Number(id)
                }
            });

            return UserType;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUserType(id) {
        try {
            const UserTypeToDelete = await database.user_type.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (UserTypeToDelete) {
                return await UserTypeToDelete.destroy();
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default UserTypeService;