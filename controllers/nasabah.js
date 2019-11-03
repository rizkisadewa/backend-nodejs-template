import NasabahService from '../services/nasabah';
import MasterService from '../services/master';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';
import {
    body,
    validationResult
} from 'express-validator';
import moment from 'moment';

const resUtil = new ResponseUtil();

class NasabahController {
    static async getAllNasabahs(req, res) {
        try {
            const allNasabahs = await NasabahService.getAllNasabahs();

            if (allNasabahs.length > 0) {
                resUtil.setSuccess(200, 'Data Nasabah berhasil ditampilkan', allNasabahs);
            } else {
                resUtil.setSuccess(200, 'Data Nasabah kosong');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async addNasabah(req, res) {
        const newNasabah = emptyStringsToNull(req.body);
        try {
            const createdNasabah = await NasabahService.addNasabah(newNasabah);
            resUtil.setSuccess(201, 'Nasabah berhasil ditambahkan', createdNasabah);
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

    static async updateNasabah(req, res) {
        const alteredNasabah = emptyStringsToNull(req.body);
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Nasabah harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const updateNasabah = await NasabahService.updateNasabah(id, alteredNasabah);

            if (!updateNasabah) {
                resUtil.setError(404, `Nasabah dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Nasabah berhasil diubah', updateNasabah);
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

    static async getNasabah(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Nasabah harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const nasabah = await NasabahService.getNasabah(id);

            if (!nasabah) {
                resUtil.setError(404, `Nasabah dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Nasabah berhasil ditampilkan', nasabah);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async deleteNasabah(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id Nasabah harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const deleteNasabah = await NasabahService.deleteNasabah(id);

            if (!deleteNasabah) {
                resUtil.setError(404, `Nasabah dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'Nasabah berhasil dihapus');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async getPrimaryData(req, res) {
        try {
            let result = {};
            result.user = req.user;
            const tableWN = {
                table_id: "kode_negara_mstr",
                value_id: "concat(id_negara, ':', kode)",
                text_id: "negara",
                param_id: "",
                param_value: "",
                sort_id: "",
                sort_value: ""
            };
            result.warganegara = await MasterService.get(tableWN);
            const tableJT = {
                table_id: "jenis_tabungan_mstr",
                value_id: "id_tabungan",
                text_id: "keterangan",
                param_id: "",
                param_value: "",
                sort_id: "",
                sort_value: ""
            };
            result.jenis_tabungan = await MasterService.get(tableJT);
            resUtil.setSuccess(200, 'API Primary Data berhasil ditampilkan', result);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async savePrimaryData(req, res) {
        try {
            const errors = validationResult(req);
            const errorFile = req.fileValidationError;

            if (!errors.isEmpty()) {
                throw errors.array()[0].msg;
            }

            if (errorFile) {
                throw errorFile;
            }

            const primaryData = req.body;
            const files = req.files;

            const kodeNegara = primaryData.warganegara.split(':');
            primaryData.warganegara = kodeNegara[0];
            primaryData.handphone = kodeNegara[1] + parseInt(primaryData.handphone).toString();
            primaryData.tgl_lahir = moment(primaryData.tgl_lahir).format('YYYY-MM-DD');
            primaryData.foto_ktp = `${files[0].fieldname}/${files[0].originalname}`;

            const createdNasabah = await NasabahService.addNasabah(primaryData);
            resUtil.setSuccess(201, 'Nasabah berhasil ditambahkan', createdNasabah);

            resUtil.setSuccess(200, 'Response', primaryData);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static validate(method) {
        switch (method) {
            case 'primary-data': {
                return [
                    body('nama_nsb').not().isEmpty().withMessage('Nama Nasabah harus diisi'),
                    body('nama_singkat').not().isEmpty().withMessage('Nama Singkat harus diisi'),
                    body('tgl_lahir').not().isEmpty().withMessage('Tanggal Lahir harus diisi'),
                    body('warganegara').not().isEmpty().withMessage('Warga Negara harus diisi'),
                    body('handphone').not().isEmpty().withMessage('Nomor Telepon harus diisi'),
                    body('jenis_tabungan').not().isEmpty().withMessage('Jenis Tabungan harus diisi'),
                    body('no_kartu').not().isEmpty().withMessage('Nomor Kartu harus diisi'),
                    body('setoran_awal').not().isEmpty().withMessage('Setoran Awal harus diisi')
                ]
            }
        }
    }
}
export default NasabahController;