import database from '../models';

class CabangService {
    static async getAllCabangs() {
        try {
            return await database.cabang.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addCabang(newCabang) {
        try {
            return await database.cabang.create(newCabang);
        } catch (error) {
            throw error;
        }
    }

    static async updateCabang(id, updateCabang) {
        try {
            const cabangToUpdate = await database.cabang.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (cabangToUpdate) {
                return await cabangToUpdate.update(updateCabang);
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getCabang(id) {
        try {
            const cabang = await database.cabang.findOne({
                where: {
                    id: Number(id)
                }
            });

            return cabang;
        } catch (error) {
            throw error;
        }
    }

    static async deleteCabang(id) {
        try {
            const cabangToDelete = await database.cabang.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (cabangToDelete) {
                return await cabangToDelete.destroy();
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default CabangService;