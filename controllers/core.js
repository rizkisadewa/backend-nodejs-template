import axios from 'axios';
import hmacsha1 from 'hmacsha1';
import moment from 'moment';
import NasabahService from '../services/nasabah';
import ResponseUtil from '../utils/response';
import {
    secretKey,
    gateway,
    channel,
    baseUrl,
    functionId
} from '../config/core';

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
            const auth = hmacsha1(secretKey, functionId.createCIFPerorangan + gateway + date.format('YYYY-MM-DDHHmmss'));
            const response = await axios.post(baseUrl, {
                authKey: auth,
                reqId: functionId.createCIFPerorangan,
                txDate: date.format('YYYYMMDD'),
                txHour: date.format('HHmmss'),
                userGtw: secretKey,
                channelId: channel,
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
}
export default CoreController;