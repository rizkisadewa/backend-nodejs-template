import axios from 'axios';
import hmacsha1 from 'hmacsha1';
import moment from 'moment';
import querystring from 'querystring';
import NasabahService from '../services/nasabah';
import ResponseUtil from '../utils/response';
import {
    userGtw,
    gateway,
    channel,
    baseUrl as coreUrl,
    functionId
} from '../config/core';
import {
    baseUrl as dataBalikanUrl,
    idLembaga,
    namaLembaga,
    token
} from '../config/data-balikan';

const resUtil = new ResponseUtil();

class CoreController {
    static async createCIFPerorangan(req, res) {
        try {
            const {
                id
            } = req.query;
            const {
                user
            } = req;
            const nasabah = await NasabahService.getNasabahCustom(id);
            const date = moment().subtract(5, 'm');
            const auth = hmacsha1(userGtw.v2, functionId.createCIFPerorangan + gateway + date.format('YYYY-MM-DDHHmmss'));
            const response = await axios.post(coreUrl.v2, {
                authKey: auth,
                reqId: functionId.createCIFPerorangan,
                txDate: date.format('YYYYMMDD'),
                txHour: date.format('HHmmss'),
                userGtw: userGtw.v2,
                channelId: channel.v2,
                param: {
                    BRANCHID: nasabah.kd_cab,
                    BRTDT: nasabah.tgl_lahir,
                    NOHP: '+' + nasabah.handphone,
                    CIFTYPE: 0,
                    FULLNM: nasabah.nama_nsb,
                    SURENM: nasabah.nama_nsb,
                    MOTHRNM: nasabah.nama_ibu,
                    ALIAS: nasabah.nama_singkat,
                    SEX: nasabah.jns_kelamin,
                    RELIGIONID: nasabah.kode_agama,
                    BRTPLACE: nasabah.tempat_lahir,
                    HOBBY: nasabah.hobby,
                    POSTDEGREE: 'A.Md.', // nasabah.pendidikan (id_pendidikan / keterangan)
                    MARRIAGEID: nasabah.sts_nikah,
                    BLOODTYPE: 'O', // field?
                    TXTRF: '50,000,000.00', // field?
                    USERID: user.username,
                    AOID: user.kode,
                    NPWP: nasabah.npwp,
                    TXCASH: nasabah.setoran_awal,
                    TYPEID: nasabah.kd_identitas,
                    IDNBR: nasabah.no_identitas,
                    EXPDT: nasabah.no_identitas_exp,
                    LASTEDUID: '0103', // field?
                    INSURED: 0, // field?
                    HOMEID: 2, // field?
                    BANKREL: nasabah.hubank,
                    OWNID: '9000', // field?
                    TBRINVEST: 0, // field?
                    TBREDU: 0, // field?
                    TBRBUSS: 1, // field?
                    TBRCAPITAL: 0, // field?
                    TBROTHER: '', // field?
                    TXMAIN: 1, // field?
                    TAXID: 2, // field?
                    NIP: '201103379', // field?
                    MAINSALID: '01', // field?
                    ADDR: nasabah.alamat_ktp,
                    RT: nasabah.rt,
                    RW: nasabah.rw,
                    KELNM: nasabah.kelurahan,
                    KECNM: nasabah.kecamatan,
                    PROVID: nasabah.provinsi,
                    CITYID: nasabah.kota,
                    POSTALCD: nasabah.kode_pos,
                    COUNTRYID: 'ID', // field?
                    AREACODE: nasabah.kode_area,
                    PHONENBR: nasabah.telp_rumah,
                    NOFAX: '02200200000', // field?
                    JOBID: '007', // field?
                    DTSTARTJOB: '2014-01-01', // field?
                    FUNCJOB: '3', // field?
                    NOTEFUNC: 'Programmer', // field?
                    OTHERINFO: '01', // field?
                    STSJOB: 1, // field?
                    BUSSID: '9990', // field?
                    NOTEBUS: 'Konsultan IT', // field?
                    NMJOB: '03', // field?
                    COMNMJOB: 'PERUSAHAAN (TERMASUK BANK)', // field?
                    NOTECOMNM: 'Collega', // field?
                    ADDRJOB: 'CILANDAK', // field?
                    POSTALCODEJOB: '00100', // field?
                    LOCJOB: '1', // field?
                    EMAILJOB: 'xx@xx.com', // field?
                    NOTELPJOB: '021-1212121' // field?
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            resUtil.setSuccess(response.status, response.statusText, response.data);
            return resUtil.send(res);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                resUtil.setError(error.response.status, error.response.data);
                return resUtil.send(res);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }

    static async createCIF(req, res) {
        const {
            id
        } = req.params;
        const {
            user
        } = req;
        try {
            const nasabah = await NasabahService.getNasabahCustom(id);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};FULLNM=${nasabah.nama_nsb};SURENM=${nasabah.nama_singkat};IDTYPE=${nasabah.kd_identitas};IDNBR=${nasabah.no_identitas};NOHP=${nasabah.handphone};CIFTYPE=0;USERID=${user.username}`);
            const response = await axios.post(coreUrl.v1.set, null, {
                params: {
                    channelid: channel.v1,
                    userGtw: userGtw.v1,
                    id: functionId.createCIF,
                    input: body
                }
            });

            if (response.data.STATUS === 1) {
                await NasabahService.updateNasabah(id, {
                    nocif: response.data.CIFID
                });
                const balikan = await axios.post(dataBalikanUrl.store, querystring.stringify({
                    nik: response.data.IDNBR,
                    id_lembaga: idLembaga,
                    nama_lembaga: namaLembaga,
                    param: [{
                        NO_CIF: response.data.CIFID,
                        NO_HP: response.data.NOHP,
                        NAMA: response.FULLNM
                    }]
                }), {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                resUtil.setSuccess(response.status, response.statusText, {
                    cif: response.data,
                    balikan: balikan.data
                });
                return resUtil.send(res);
            } else {
                resUtil.setSuccess(response.status, response.statusText, response.data);
                return resUtil.send(res);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                resUtil.setError(error.response.status, error.response.data);
                return resUtil.send(res);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }

    static async updateCIF(req, res) {
        const {
            id
        } = req.params;
        const {
            user
        } = req;
        try {
            const nasabah = await NasabahService.getNasabahCustom(id);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};CIFTYPE=0;FULLNM=${nasabah.nama_nsb};SURENM=${nasabah.nama_singkat};ADDRESS=${nasabah.alamat_ktp};CITY=${nasabah.kota};POSTALCD=${nasabah.kode_pos};GENDER=${nasabah.jns_kelamin};RELIGION=${nasabah.kode_agama};BRTDT=${nasabah.tgl_lahir};BRTPLACE=${nasabah.tempat_lahir};IDTYPE=${nasabah.kd_identitas};IDNBR=${nasabah.no_identitas};INCOME=${nasabah.penghasilan};MOTHERNM=${nasabah.nama_ibu};RT=${nasabah.rt};RW=${nasabah.rw};PROVID=${nasabah.provinsi};NPWP=${nasabah.npwp};AREACODE=${nasabah.kode_area};PHONENBR=${nasabah.telp_rumah};NOHP=${nasabah.handphone};EMAIL=${nasabah.email};GRADE=${nasabah.pendidikan_text};HOBI=${nasabah.hobby};MARRIAGEID=${nasabah.sts_nikah};JOBID=${nasabah.pekerjaan};COMPNM=${nasabah.nama_prs};COMPADDR=${nasabah.alamat_prs};AVGTXDAILY=${nasabah.rata_akt_daily};EXPIDEN=${nasabah.no_identitas_exp};USERID=${user.username}`);
            const response = await axios.post(coreUrl.v1.set, null, {
                params: {
                    channelid: channel.v1,
                    userGtw: userGtw.v1,
                    id: functionId.createCIF,
                    input: body
                }
            });

            resUtil.setSuccess(response.status, response.statusText, response.data);
            return resUtil.send(res);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                resUtil.setError(error.response.status, error.response.data);
                return resUtil.send(res);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }

    static async createTabungan(req, res) {
        const {
            id
        } = req.params;
        const {
            user
        } = req;
        try {
            const nasabah = await NasabahService.getNasabahCustom(id);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};APPLID=2;PRODID=${nasabah.jenis_tabungan};SVGTYPE=${nasabah.sifat_dana};USERID=${user.username}`);
            const response = await axios.post(coreUrl.v1.set, null, {
                params: {
                    channelid: channel.v1,
                    userGtw: userGtw.v1,
                    id: functionId.createTabungan,
                    input: body
                }
            });

            if (response.data.STATUS === 1) {
                await NasabahService.updateNasabah(id, {
                    rek_bjbs: response.data.ACCNBR
                });
            }

            resUtil.setSuccess(response.status, response.statusText, response.data);
            return resUtil.send(res);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                resUtil.setError(error.response.status, error.response.data);
                return resUtil.send(res);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }

    static async cardActivate(req, res) {
        const {
            id
        } = req.params;
        try {
            const nasabah = await NasabahService.getNasabahCustom(id);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};ACCNBR=${nasabah.rek_bjbs};FULLNM=${nasabah.nama_nsb};SURENM=${nasabah.nama_singkat};SVGTYPE=${nasabah.sifat_dana};CARDNO=${nasabah.no_kartu}`);
            const response = await axios.post(coreUrl.v1.set, null, {
                params: {
                    channelid: channel.v1,
                    userGtw: userGtw.v1,
                    id: functionId.cardActivate,
                    input: body
                }
            });

            resUtil.setSuccess(response.status, response.statusText, response.data);
            return resUtil.send(res);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                resUtil.setError(error.response.status, error.response.data);
                return resUtil.send(res);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    }
}
export default CoreController;