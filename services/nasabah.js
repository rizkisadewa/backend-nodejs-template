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
                handphone,
                SUBSTRING(handphone, 1, 2) as kode_negara,
                jenis_tabungan,
                jtm.keterangan as jenis_tabungan_text,
                no_kartu,
                setoran_awal,
                foto_ktp
            FROM
                nasabah nsb
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
                sql_condition += ` WHERE nsb.status_primary_data = 'approved' AND nsb.status_secondary_data IS NULL `;
            } 
            else if(status == "pending")
            {
                sql_condition += ` WHERE nsb.status_primary_data = 'pending' OR nsb.status_secondary_data = 'pending' OR
                                     nsb.status_primary_data = 'rejected' OR nsb.status_secondary_data = 'rejected' `;
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
            else if(status == "approved")
            {
                sql_condition += ` 
                    WHERE nsb.status_primary_data = 'approved' OR 
                    nsb.status_secondary_data = 'approved' 
                `;
            } 
            else if(status == "rejected")
            {
                sql_condition += ` 
                    WHERE nsb.status_primary_data = 'rejected' OR 
                    nsb.status_secondary_data = 'rejected' 
                `;
            } 
            
            query = query + sql_condition;

            //pagination
            let limitation =  ``;

            if(page > 0)
            {
                limitation = ` offset '${offset}' limit '${max_page}' `;
            }

            const primaryData = {};
            
            //get data with limitation
            primaryData.rows = await database.sequelize.query(query+limitation , {
                type: database.Sequelize.QueryTypes.SELECT
            });

            //get max page 
            const temp_size = await database.sequelize.query(query , {
                type: database.Sequelize.QueryTypes.SELECT
            });
            
            primaryData.max_page = Math.ceil(temp_size.length/max_page);

            return primaryData;

        } catch (error) {
            throw error;
        }
    }

    static async sendRequestData(id) {
        try {
            const query = `
            UPDATE nasabah SET (status_primary_data, status_secondary_data) = (CASE WHEN status_primary_data = 'pending' THEN 'waiting_update' ELSE status_primary_data END, CASE WHEN status_secondary_data = 'pending' THEN 'waiting_update' ELSE status_secondary_data END)
            WHERE id = '${id}'
            `;
            const result = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default NasabahService;