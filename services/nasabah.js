import database from '../models';

class NasabahService {
    static async getAllNasabahs() {
        try {
            return await database.nasabah.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addNasabah(newNasabah) {
        try {
            return await database.nasabah.create(newNasabah);
        } catch (error) {
            throw error;
        }
    }

    static async updateNasabah(id, updateNasabah) {
        try {
            const nasabahToUpdate = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (nasabahToUpdate) {
                return await nasabahToUpdate.update(updateNasabah);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getNasabah(id) {
        try {
            const nasabah = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            return nasabah;
        } catch (error) {
            throw error;
        }
    }

    static async getPrimaryData(id) {
        try {
            const query = `
            SELECT
                kd_cab,
                kd_agen,
                nama_nsb,
                nama_singkat,
                tgl_lahir,
                knm.kode as kode_negara,
                knm.negara as warganegara,
                handphone,
                jtm.keterangan as jenis_tabungan,
                no_kartu,
                setoran_awal,
                foto_ktp
            FROM
                nasabah nsb
            LEFT JOIN
                kode_negara_mstr knm ON knm.id_negara::character varying = nsb.warganegara
            LEFT JOIN
                jenis_tabungan_mstr jtm ON jtm.id_tabungan = nsb.jenis_tabungan
            WHERE
                id = '${id}'
            `;
            const primaryData = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return primaryData.length > 0 ? primaryData[0] : {};
        } catch (error) {
            throw error;
        }
    }

    static async deleteNasabah(id) {
        try {
            const nasabahToDelete = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (nasabahToDelete) {
                return await nasabahToDelete.destroy();
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default NasabahService;