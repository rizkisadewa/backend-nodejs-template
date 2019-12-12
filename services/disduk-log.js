import database from '../models';

class DisdukLogService {
  static async getAllDisdukLogs(){
    try {
      return await database.disduk_log.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addDisdukLog(newDisdukLog){
    try{
      return await database.disduk_log.create(newDisdukLog);
    } catch (error) {
      throw error;
    }
  }

  static async updateDisdukLog(id, updateDisdukLog){
    try{
      const disdukLogToUpdate = await database.disduk_log.findOne({
        where: {
          id: Number(id)
        }
      });

      if(disdukLogToUpdate){
        return await disdukLogToUpdate.update(updateDisdukLog);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getDisdukLog(id){
    try {
      const disdukLog = await database.disduk_log.findOne({
        where: {
          id: Number(id)
        }
      });
      return disdukLog;
    } catch (error) {
      throw error
    }
  }

  static async deleteDisdukLog(id){
    try{
      const disdukLogToDelete = await database.disduk_log.findOne({
        where: {
          id: Number(id)
        }
      });

      if(disdukLogToDelete){
        return await disdukLogToDelete.destroy();
      }

      return null;
    }catch (error){
      throw error;
    }
  }

}

export default DisdukLogService;
