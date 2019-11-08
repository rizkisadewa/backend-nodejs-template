import NasabahService from '../services/nasabah';
import MasterService from '../services/master';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';
import {
    master
} from '../config/master';
import {
    body,
    validationResult
} from 'express-validator';
import moment from 'moment';
import path from 'path';
import base64Img from 'base64-img';

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
            result.box = {};
            result.box.kode_negara = await MasterService.get(master.kode_negara());
            result.box.jenis_tabungan = await MasterService.get(master.jenis_tabungan());

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

            let primaryData = req.body;
            const files = req.files;

            primaryData.handphone = primaryData.kode_negara + parseInt(primaryData.handphone).toString();
            primaryData.tgl_lahir = moment(primaryData.tgl_lahir).format('YYYY-MM-DD');
            primaryData.foto_ktp = `${files[0].fieldname}/${files[0].originalname}`;

            delete primaryData.kode_negara;

            const createdNasabah = await NasabahService.addNasabah(primaryData);
            resUtil.setSuccess(201, 'Nasabah berhasil ditambahkan', createdNasabah);

            resUtil.setSuccess(200, 'Response', primaryData);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async getSecondaryData(req, res) {
        try {
            const {
                id
            } = req.query;
            let result = {};

            // Data Primary
            result.primary_data = await NasabahService.getPrimaryData(id);
            result.primary_data.foto_ktp = base64Img.base64Sync(path.join(path.resolve(), `public/uploads/${result.primary_data.foto_ktp}`));

            // Master Selectbox
            result.box = {};
            result.box.kd_identitas = await MasterService.get(master.kd_identitas());
            result.box.jns_kelamin = await MasterService.get(master.jns_kelamin());
            result.box.kode_agama = await MasterService.get(master.kode_agama());
            result.box.pendidikan = await MasterService.get(master.pendidikan());
            result.box.sts_nikah = await MasterService.get(master.sts_nikah());
            result.box.sifat_dana = await MasterService.get(master.sifat_dana());
            result.box.penghasilan = await MasterService.get(master.penghasilan());
            result.box.sumdana = await MasterService.get(master.sumdana());
            result.box.pekerjaan = await MasterService.get(master.pekerjaan());
            result.box.jabatan = await MasterService.get(master.jabatan());
            result.box.usaha = await MasterService.get(master.usaha());
            result.box.hubank = await MasterService.get(master.hubank());
            result.box.tujuan = await MasterService.get(master.tujuan());
            result.box.kewarganegaraan_sts = await MasterService.get(master.kewarganegaraan_sts());
            result.box.provinsi = await MasterService.get(master.provinsi());
            result.box.kota = await MasterService.get(master.kota());

            resUtil.setSuccess(200, 'API Secondary Data berhasil ditampilkan', result);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async saveSecondaryData(req, res) {
        try {
            const {
                id
            } = req.params;
            const errors = validationResult(req);


            if (!Number(id)) {
                resUtil.setError(400, 'id Nasabah harus bernilai angka');
                return resUtil.send(res);
            }

            if (!errors.isEmpty()) {
                throw errors.array()[0].msg;
            }

            let secondaryData = req.body;

            const updatedNasabah = await NasabahService.updateNasabah(id, secondaryData);
            resUtil.setSuccess(201, 'Nasabah berhasil diperbarui', updatedNasabah);

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
                    body('kode_negara').not().isEmpty().withMessage('Kode Negara harus diisi'),
                    body('handphone').not().isEmpty().withMessage('Nomor Telepon harus diisi'),
                    body('jenis_tabungan').not().isEmpty().withMessage('Jenis Tabungan harus diisi'),
                    body('no_kartu').not().isEmpty().withMessage('Nomor Kartu harus diisi'),
                    body('setoran_awal').not().isEmpty().withMessage('Setoran Awal harus diisi')
                ];
            }
            case 'secondary-data': {
                return [
                    body('kd_identitas').not().isEmpty().withMessage('Kode Identitas harus diisi'),
                    body('no_identitas').not().isEmpty().withMessage('Nomor Kartu Identitas harus diisi'),
                    body('alamat_ktp').not().isEmpty().withMessage('Alamat (KTP) harus diisi'),
                    body('rt').not().isEmpty().withMessage('RT harus diisi'),
                    body('rw').not().isEmpty().withMessage('RW harus diisi'),
                    body('kelurahan').not().isEmpty().withMessage('Kelurahan harus diisi'),
                    body('kecamatan').not().isEmpty().withMessage('Kecamatan harus diisi'),
                    body('kota').not().isEmpty().withMessage('Kota harus diisi'),
                    body('kode_pos').not().isEmpty().withMessage('Kode Pos harus diisi'),
                    body('alamat_domisili').not().isEmpty().withMessage('Alamat (Domisili) harus diisi'),
                    body('jns_kelamin').not().isEmpty().withMessage('Jenis Kelamin harus diisi'),
                    body('kode_agama').not().isEmpty().withMessage('Agama harus diisi'),
                    body('tempat_lahir').not().isEmpty().withMessage('Tempat Lahir harus diisi'),
                    body('kewarganegaraan_sts').not().isEmpty().withMessage('Kewarganegaraan Status harus diisi'),
                    body('no_identitas_exp').not().isEmpty().withMessage('Masa Berlaku Identitas harus diisi'),
                    body('nama_ibu').not().isEmpty().withMessage('Nama Ibu harus diisi'),
                    body('provinsi').not().isEmpty().withMessage('Dati I harus diisi'),
                    body('kode_area').not().isEmpty().withMessage('Kode Area harus diisi'),
                    body('telp_rumah').not().isEmpty().withMessage('Nomor Telpon Rumah harus diisi'),
                    body('pendidikan').not().isEmpty().withMessage('Status Gelar harus diisi'),
                    body('sts_nikah').not().isEmpty().withMessage('Status Menikah harus diisi'),
                    body('sifat_dana').not().isEmpty().withMessage('Sifat Dana harus diisi'),
                    body('penghasilan').not().isEmpty().withMessage('Penghasilan harus diisi'),
                    body('sumdana').not().isEmpty().withMessage('Sumber Dana harus diisi'),
                    body('pekerjaan').not().isEmpty().withMessage('Pekerjaan harus diisi'),
                    body('jabatan').not().isEmpty().withMessage('Jabatan harus diisi'),
                    body('usaha').not().isEmpty().withMessage('Bidang Usaha harus diisi'),
                    body('nama_prs').not().isEmpty().withMessage('Nama Perusahaan harus diisi'),
                    body('alamat_prs').not().isEmpty().withMessage('Alamat Perusahaan harus diisi'),
                    body('rata_akt_daily').not().isEmpty().withMessage('Aktivitas Transaksi harus diisi'),
                    body('hubank').not().isEmpty().withMessage('Hubungan Bank harus diisi'),
                    body('tujuan').not().isEmpty().withMessage('Tujuan harus diisi')
                ];
            }
        }
    }

    static async getAllNasabahByStatus(req, res) {
        try {

            const {
                page,
                status
            } = req.query;

            const allNasabah = await NasabahService.getNasabahByStatus(status, page);

            if (allNasabah.rows.length > 0) {
                resUtil.setSuccess(200, 'Data Nasabah berhasil ditampilkan', allNasabah);
            } else {
                resUtil.setSuccess(200, 'Data Nasabah kosong', allNasabah);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }


}
export default NasabahController;