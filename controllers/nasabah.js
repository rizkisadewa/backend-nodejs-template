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
import fs from 'fs-extra';
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

            const {
                id
            } = req.params;

            if (id) {
                result.nasabah = await NasabahService.getNasabahCustom(id);
                if (Object.keys(result.nasabah).length > 0) {
                    const file = path.join(path.resolve(), `public/uploads/${result.nasabah.foto_ktp}`);
                    if (fs.existsSync(file)) {
                        result.nasabah.foto_ktp = base64Img.base64Sync(file);
                    } else {
                        result.nasabah.foto_ktp = null;
                    }
                    const file2 = path.join(path.resolve(), `public/uploads/${result.nasabah.foto_nasabah_ktp}`);
                    if (fs.existsSync(file2)) {
                        result.nasabah.foto_nasabah_ktp = base64Img.base64Sync(file2);
                    } else {
                        result.nasabah.foto_nasabah_ktp = null;
                    }
                    result.nasabah.handphone = result.nasabah.handphone.substring(2);
                } else {
                    resUtil.setError(404, `Nasabah dengan id: ${id} tidak ditemukan`);
                    return resUtil.send(res);
                }
            } else {
                result.user = req.user;
            }

            result.box = {};
            result.box.kd_identitas = await MasterService.get(master.kd_identitas());
            result.box.kode_negara = await MasterService.get(master.kode_negara());
            result.box.jenis_tabungan = await MasterService.get(master.jenis_tabungan());
            result.box.setoran_awal = await MasterService.get(master.setoran_awal());

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

            let primaryData = emptyStringsToNull(req.body);
            const files = req.files;

            primaryData.tgl_lahir = moment(primaryData.tgl_lahir).format('YYYY-MM-DD');
            primaryData.no_identitas_exp = moment(primaryData.tgl_lahir).add(1000, 'y').format('YYYY-MM-DD'); // set maximum date

            const {
                id
            } = req.params;

            if (id) {
                delete primaryData.foto_ktp;
                delete primaryData.foto_nasabah_ktp;
                primaryData.handphone = primaryData.kode_negara + parseInt(primaryData.handphone).toString();
                if (files.length > 1) {
                    primaryData.foto_ktp = `${files[0].fieldname}/${files[0].originalname}`;
                    primaryData.foto_nasabah_ktp = `${files[1].fieldname}/${files[1].originalname}`;
                } else if (files.length > 0) {
                    if (files[0].fieldname === 'file_foto_ktp') {
                        primaryData.foto_ktp = `${files[0].fieldname}/${files[0].originalname}`;
                    } else {
                        primaryData.foto_nasabah_ktp = `${files[0].fieldname}/${files[0].originalname}`;
                    }
                }
                delete primaryData.kode_negara;
                const updatedNasabah = await NasabahService.updateNasabah(id, primaryData);
                resUtil.setSuccess(201, 'Nasabah berhasil perbaharui', updatedNasabah);
            } else {
                primaryData.handphone = primaryData.kode_negara + parseInt(primaryData.handphone).toString();
                primaryData.foto_ktp = `${files[0].fieldname}/${files[0].originalname}`;
                primaryData.foto_nasabah_ktp = `${files[1].fieldname}/${files[1].originalname}`;
                delete primaryData.kode_negara;
                const createdNasabah = await NasabahService.addNasabah(primaryData);
                resUtil.setSuccess(201, 'Nasabah berhasil ditambahkan', createdNasabah);
            }

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
            result.nasabah = await NasabahService.getNasabahCustom(id);
            const file = path.join(path.resolve(), `public/uploads/${result.nasabah.foto_ktp}`);
            if (fs.existsSync(file)) {
                result.nasabah.foto_ktp = base64Img.base64Sync(file);
            } else {
                result.nasabah.foto_ktp = null;
            }
            const file2 = path.join(path.resolve(), `public/uploads/${result.nasabah.foto_nasabah_ktp}`);
            if (fs.existsSync(file2)) {
                result.nasabah.foto_nasabah_ktp = base64Img.base64Sync(file2);
            } else {
                result.nasabah.foto_nasabah_ktp = null;
            }

            if (result.nasabah.kota_ktp && !result.nasabah.kota) {
                result.nasabah.kota = await MasterService.getKota(result.nasabah.kota_ktp);
            }

            if (result.nasabah.provinsi_ktp && !result.nasabah.provinsi) {
                result.nasabah.provinsi = await MasterService.getProvinsi(result.nasabah.provinsi_ktp);
            }

            // Master Selectbox
            result.box = {};
            // result.box.kd_identitas = await MasterService.get(master.kd_identitas());
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
            result.box.warganegara = await MasterService.get(master.warganegara());
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

            let secondaryData = emptyStringsToNull(req.body);
            secondaryData.status_secondary_data = 'pending';

            const updatedNasabah = await NasabahService.updateNasabah(id, secondaryData);
            resUtil.setSuccess(201, 'Nasabah berhasil diperbarui', updatedNasabah);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async sendRequestData(req, res) {
        try {
            const {
                id
            } = req.params;

            const {
                keterangan
            } = req.body;

            if (!Number(id)) {
                resUtil.setError(400, 'id Nasabah harus bernilai angka');
                return resUtil.send(res);
            }

            const result = await NasabahService.sendRequestData(id, keterangan);
            resUtil.setSuccess(201, 'Nasabah berhasil diperbarui', result);

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
                    body('kd_identitas').not().isEmpty().withMessage('Kode Identitas harus diisi'),
                    body('no_identitas').not().isEmpty().withMessage('Nomor Kartu Identitas harus diisi'),
                    body('nama_nsb').not().isEmpty().withMessage('Nama Nasabah harus diisi'),
                    body('nama_singkat').not().isEmpty().withMessage('Nama Singkat harus diisi'),
                    body('tgl_lahir').not().isEmpty().withMessage('Tanggal Lahir harus diisi'),
                    body('kode_negara').not().isEmpty().withMessage('Kode Negara harus diisi'),
                    body('handphone').not().isEmpty().withMessage('Nomor Telepon harus diisi'),
                    body('jenis_tabungan').custom((value, {
                        req
                    }) => {
                        if (!value) {
                            throw new Error('Jenis Tabugan harus diisi');
                        }

                        if (value !== '0252' && !req.body.no_kartu) {
                            throw new Error('Nomor Kartu harus diisi');
                        }

                        return true;
                    }),
                    body('setoran_awal').not().isEmpty().withMessage('Setoran Awal harus diisi')
                ];
            }
            case 'secondary-data': {
                return [
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
                    body('warganegara').not().isEmpty().withMessage('Kewarganegaraan Status harus diisi'),
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
        const {
            page,
            status
        } = req.query;

        const {
            user
        } = req;
        try {
            const allNasabah = await NasabahService.getNasabahByStatus(user.kode_cabang, status, page);

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

    static async approveReqNewData(req, res) {
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

    static async rejectReqNewData(req, res) {
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

    static async approveReqUpdateData(req, res) {
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

    static async rejectReqUpdateData(req, res) {
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

    // Laporan Pembukaan Rekening
    static async getAllNasabahLapPembRek(req, res) {

        try {

            const {
                page,
                status
            } = req.query;

            const allNasabahLapPembRek = {};

            if (allNasabahLapPembRek.length > 0) {
                resUtil.setSuccess(200, 'Data Laporan Pembukaan Rekening Nasabah berhasil ditampilkan', allNasabahLapPembRek);
            } else {
                resUtil.setSuccess(200, 'Data Laporan Pembukaan Rekening Nasabah kosong', allNasabahLapPembRek);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    // Report Pembukaan Rekening
    static async getReportPembukaanRekeningData(req, res) {
        try {

            let result = {};

            const {
                tgl_awal,
                tgl_akhir
            } = req.params;

            if (tgl_awal && tgl_akhir) {
                result.nasabah = await NasabahService.getReportPembukaanRekeningData(tgl_awal, tgl_akhir);
                if (Object.keys(result.nasabah).length <= 0) {
                    resUtil.setError(404, `Report dari tanggal ${tgl_awal} s.d. ${tgl_akhir} tidak ditemukan`)
                    return resUtil.send(res);
                }
            } else {
                result.user = req.user
            }

            resUtil.setSuccess(200, 'API Report Pembukaan Rekening Export View berhasil ditampilkan', result);

            return resUtil.send(res);

        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }
}
export default NasabahController;