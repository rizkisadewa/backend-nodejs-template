import database from '../models';

class UserService {
    static async getAllUsers() {
        try {
            return await database.user.findAll({
                order: [['modified', 'DESC']]
            });
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
            const user = await database.user.findOne({
                attributes: ['no_tlp'],
                where: {
                    kode_cabang: kode_cabang,
                    kode_user_type: '003'
                }
            });

            return user.no_tlp;
        } catch (error) {
            throw error;
        }
    }

    static async getNomor(kode) {
        try {
            const user = await database.user.findOne({
                attributes: ['no_tlp'],
                where: {
                    kode: kode
                }
            });

            return user.no_tlp;
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

    static async getUserByKode(kode) {
        try {
            const user = await database.user.findOne({
                attributes: {
                    exclude: ['password', 'created', 'modified']
                },
                where: {
                    kode: kode
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

    // Get user by User Type && Nama Cabang
    static async getUserCustom(id){
      try{
        let query = `
          SELECT
            usr.kode,
            usr.username,
            usr.nama,
            usr.alamat,
            usr.no_ktp,
            usr.no_tlp,
            usr.foto,
            usr.id,
            usr.aoid,
            cabang.nama as nama_cabang,
            user_type.nama as user_type
          FROM
            public.user usr
          LEFT JOIN
            cabang ON cabang.kode = usr.kode_cabang
          LEFT JOIN
            user_type ON user_type.kode = usr.kode_user_type
          WHERE
            usr.id = '${id}'
        `;

        // get the data
        const userData = await database.sequelize.query(query , {
            type: database.Sequelize.QueryTypes.SELECT
        });

        return userData.length > 0 ? userData[0] : {};
      } catch (error) {
        throw error;
      }
    }

    // Get All User Custom
    static async getAllUsersCustom(page) {
      try{
        let query = `
          SELECT
            usr.kode,
            usr.username,
            usr.nama,
            usr.alamat,
            usr.no_ktp,
            usr.no_tlp,
            usr.foto,
            usr.id,
            cabang.nama as nama_cabang,
            user_type.nama as user_type
          FROM
            public.user usr
          LEFT JOIN
            cabang ON cabang.kode = usr.kode_cabang
          LEFT JOIN
            user_type ON user_type.kode = usr.kode_user_type
        `;

        const max_page = 10;
        const offset = ((page - 1) * max_page);

        //pagination
        let limitation =  ``;

        if(page > 0)
        {
            limitation = ` offset '${offset}' limit '${max_page}' `;
        }

        const allUsersCustomData = {};

        //get data with limitation
        allUsersCustomData.rows = await database.sequelize.query(query , {
            type: database.Sequelize.QueryTypes.SELECT
        });

        //get max page
        const temp_size = await database.sequelize.query(query , {
            type: database.Sequelize.QueryTypes.SELECT
        });

        allUsersCustomData.max_page = Math.ceil(temp_size.length/max_page);

        return allUsersCustomData;

      } catch (error) {
        throw error;
      }
    }
}

export default UserService;
