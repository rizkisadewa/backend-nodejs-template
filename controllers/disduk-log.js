import DisdukLogService from '../services/disduk-log';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';

const resUtil = new ResponseUtil();

class DisdukLogController{
  static async getAllDisdukLogs(req, res){
    try{
      const allDisdukLogs = await DisdukLogService.getAllDisdukLogs();

      if(allDisdukLogs.length > 0){
        resUtil.setSuccess(200, 'Data Disduk Log berhasil ditampilkan');
      } else {
        resUtil.setSuccess(200, 'Data Disduk Log kosong');
      }

      return resUtil.send(res);
    } catch (error){
      resUtil.setError(400, error);
      return resUtil.send(res);
    }
  }

  static async addDisdukLog(req, res){
    const newDisdukLog = emptyStringsToNull(req.body);

    try {
      const createdDisdukLog = await DisdukLogService.addDisdukLog(newDisdukLog);
      resUtil.setSuccess(201, 'Disduk Log bashasil ditambahkan', createdDisdukLog);
      return resUtil.send(res);
    } catch (error) {
      if (error.errors) {
          resUtil.setError(400, error.errors[0].message);
      } else {
          resUtil.setError(400, error);
      }
      return resUtil.send(res);
    }
  }

  static async updateDisdukLog(req, res){
    const alteredDisdukLog = emptyStringsToNull(req.body);

    const {
      id
    } = req.params;

    if (!Number(id)) {
        resUtil.setError(400, 'id User harus bernilai angka');
        return resUtil.send(res);
    }

    try{
      const updateDisdukLog = await DisdukLogService.updateDisdukLog(id, alteredDisdukLog);

      if(!updateDisdukLog){
        resUtil.setError(404, `Disduk Log dengan id: ${id} tidak ditemukan`);
      } else {
        resUtil.setSuccess(200, 'Disduk Log berhasil diubah', updateUser);
      }

      return resUtil.send(res);
    } catch(error){
      if (error.errors) {
          resUtil.setError(400, error.errors[0].message);
      } else {
          resUtil.setError(400, error);
      }
      return resUtil.send(res);
    }
  }

  static async getDisdukLog(req, res){
    const {
      id
    } = req.params;

    if (!Number(id)) {
        resUtil.setError(400, 'id User harus bernilai angka');
        return resUtil.send(res);
    }

    try{
      const disdukLog = await DisdukLogService.getDisdukLog(id);

      if(!disdukLog){
        resUtil.setError(404, `Disduk Log dengan id : ${id} tidak ditemukan`);
      } else {
        resUtil.setSuccess(200, 'Disduk Log berhasil ditampilkan', user);
      }

      return resUtil.send(res);
    } catch (error) {
      resUtil.setError(400, error);
      return resUtil.send(res);
    }
  }

  static async deleteDisdukLog(req, res){
    const {
      id
    } = req.params;

    if (!Number(id)) {
        resUtil.setError(400, 'id User harus bernilai angka');
        return resUtil.send(res);
    }

    try{
      const deleteDisdukLog = await DisdukLogService.deleteDisdukLog(id);

      if (!deleteUser) {
          resUtil.setError(404, `Disduk Log dengan id: ${id} tidak ditemukan`);
      } else {
          resUtil.setSuccess(200, 'Disduk Log berhasil dihapus');
      }

      return resUtil.send(res);

    } catch (error) {
      resUtil.setError(400, error);
      return resUtil.send(res);
    }

  }
}

export default DisdukLogController;
