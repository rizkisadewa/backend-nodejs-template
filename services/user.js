import database from '../models';

class UserService {
    static async getAllUsers() {
        try {
            return await database.user.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addUser(newUser) {
        try {
            return await database.user.create(newUser);
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, updateUser) {
        try {
            const userToUpdate = await database.user.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (userToUpdate) {
                return await userToUpdate.update(updateUser);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const user = await database.user.findOne({
                where: {
                    id: Number(id)
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getNomorSO(kode_cabang) {
        try {
            const nomor = await database.user.findOne({
                attributes: ['no_tlp'],
                where: {
                    kode_cabang: kode_cabang,
                    kode_user_type: '003'
                }
            });

            return nomor;
        } catch (error) {
            throw error;
        }
    }

    static async getNomor(kode) {
        try {
            const nomor = await database.user.findOne({
                attributes: ['no_tlp'],
                where: {
                    kode: kode
                }
            });

            return nomor;
        } catch (error) {
            throw error;
        }
    }

    static async getUserJwt(id) {
        try {
            const user = await database.user.findOne({
                attributes: {
                    exclude: ['password', 'created', 'modified']
                },
                where: {
                    id: Number(id)
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByUsername(username) {
        try {
            const user = await database.user.findOne({
                attributes: {
                    exclude: ['created', 'modified']
                },
                where: {
                    username: username
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const userToDelete = await database.user.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (userToDelete) {
                return await userToDelete.destroy();
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;