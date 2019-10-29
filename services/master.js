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
}

export default MasterService;