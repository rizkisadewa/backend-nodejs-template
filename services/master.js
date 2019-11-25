import database from '../models';

class MasterService {
    static async get(table) {
        try {
            let query = `
            SELECT ${table.value_id} as value, ${table.text_id} as text FROM ${table.table_id}`;

            if (table.param_id) {
                query += `\nWHERE ${table.param_id} = '${table.param_value}'`;
            }

            if (table.sort_id) {
                query += `\nORDER BY ${table.sort_id} ${table.sort_value}`;
            }

            return await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });
        } catch (error) {
            throw error;
        }
    }

    static async getKota(kota_ktp) {
        try {
            let query = `
            SELECT cityid
            FROM kota_mstr
            WHERE LOWER(citynm) LIKE LOWER('%${kota_ktp}%')
            `;

            const rows = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return rows.length > 0 ? rows[0].cityid : '';
        } catch (error) {
            throw error;
        }
    }

    static async getProvinsi(provinsi_ktp) {
        try {
            let query = `
            SELECT id_propinsi
            FROM provinsi_mstr
            WHERE LOWER(keterangan) LIKE LOWER('%${provinsi_ktp}%')
            `;

            const rows = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return rows.length > 0 ? rows[0].id_propinsi : '';
        } catch (error) {
            throw error;
        }
    }
}

export default MasterService;