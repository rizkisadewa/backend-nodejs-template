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


    static async getNasabahByStatus(status, page) {
        try {
            let query = `
            SELECT
                nsb.*,
                knm.kode as kode_negara,
                knm.negara as warganegara,
                jtm.keterangan as jenis_tabungan
            FROM
                nasabah nsb
            LEFT JOIN
                kode_negara_mstr knm ON knm.id_negara::character varying = nsb.warganegara
            LEFT JOIN
                jenis_tabungan_mstr jtm ON jtm.id_tabungan = nsb.jenis_tabungan `;

            let sql_condition = ``;
            const max_page = 10;
            const offset = ((page - 1) * max_page);
		   

            if(status == "update")
            {
                sql_condition += ` WHERE nsb.status_primary_data = 'pending' `;
            } 
            else if(status == "pending")
            {
                sql_condition += ` WHERE nsb.status_secondary_data = 'pending' `;
            } 
            else if(status == "req_new_data")
            {
                sql_condition += ` WHERE nsb.status_primary_data = 'waiting_update' `;
            } 
            else if(status == "req_update_data")
            {
                sql_condition += ` WHERE nsb.status_secondary_data = 'waiting_update' `;
            }
            else if(status == "completed")
            {
                sql_condition += ` 
                    WHERE nsb.status_primary_data = 'approved' AND 
                    nsb.primary_data_keterangan = 'approved' AND 
                    nsb.status_secondary_data = 'approved' AND 
                    nsb.secondary_data_keterangan = 'approved' 
                `;
            } 
            
            query = query + sql_condition;

            //pagination
            const limitation =  ` offset '${offset}' limit '${max_page}' `;

            const primaryData = {};
            
            //get data with limitation
            primaryData.data = await database.sequelize.query(query+limitation , {
                type: database.Sequelize.QueryTypes.SELECT
            });

            //get max page 
            const temp_size = await database.sequelize.query(query , {
                type: database.Sequelize.QueryTypes.SELECT
            });
            primaryData.max_page = temp_size.length;

            return primaryData;

        } catch (error) {
            throw error;
        }
    }
}

export default NasabahService;