import CabangService from '../services/cabang';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';

const resUtil = new ResponseUtil();

class CabangController {
    static async getAllCabangs(req, res) {
        try {
            const allCabangs = await CabangService.getAllCabangs();

            if (allCabangs.length > 0) {
                resUtil.setSuccess(200, 'Data Cabang berhasil ditampilkan', allCabangs);
            } else {
                resUtil.setSuccess(200, 'Data Cabang kosong');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async addCabang(req, res) {
        const newCabang = emptyStringsToNull(req.body);
        try {
            const createdCabang = await CabangService.addCabang(newCabang);
            resUtil.setSuccess(201, 'Cabang berhasil ditambahkan', createdCabang);
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

    static async updateCabang(req, res) {
        const alteredCabang = emptyStringsToNull(req.body);
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Cabang harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const updateCabang = await CabangService.updateCabang(id, alteredCabang);

            if (!updateCabang) {
                resUtil.setError(404, `Cabang dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Cabang berhasil diubah', updateCabang);
            }

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

    static async getCabang(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Cabang harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const cabang = await CabangService.getCabang(id);

            if (!cabang) {
                resUtil.setError(404, `Cabang dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Cabang berhasil ditampilkan', cabang);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async deleteCabang(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Cabang harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const deleteCabang = await CabangService.deleteCabang(id);

            if (!deleteCabang) {
                resUtil.setError(404, `Cabang dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Cabang berhasil dihapus');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }
}
export default CabangController;