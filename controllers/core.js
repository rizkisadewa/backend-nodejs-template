import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import NasabahService from '../services/nasabah';
import ResponseUtil from '../utils/response';
import {
    userGtw,
    gateway,
    channel,
    baseUrl as coreUrl,
    functionId,
    trxAcc
} from '../config/core';

const resUtil = new ResponseUtil();

class CoreController {
    static async createCIFPerorangan(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                user
            } = req;
            const nasabah = await NasabahService.getNasabahCustom(id);
            const date = moment().add(12, 'h');
            const auth = crypto.createHmac('sha1', userGtw.v2).update(functionId.createCIFPerorangan + gateway + date.format('YYYY-MM-DDHH:mm:ss')).digest('hex');
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
                    NOHP: `+${nasabah.handphone}`,
                    CIFTYPE: 0,
                    FULLNM: nasabah.nama_nsb,
                    SURENM: nasabah.nama_singkat,
                    MOTHRNM: "HARTATI",
                    ALIAS: nasabah.nama_singkat,
                    SEX: 1,
                    RELIGIONID: 1,
                    BRTPLACE: "DUMMY DATA",
                    HOBBY: "DUMMY DATA",
                    POSTDEGREE: "A.Md.",
                    MARRIAGEID: 2,
                    BLOODTYPE: "O",
                    TXTRF: "50,000,000.00",
                    USERID: user.username,
                    AOID: "064",
                    NPWP: "698930484444000",
                    TXCASH: nasabah.setoran_awal,
                    TYPEID: "1",
                    IDNBR: "3204280104890003",
                    EXPDT: moment().add(1, 'y').format('YYYY-MM-DD'),
                    LASTEDUID: "0103",
                    INSURED: 0,
                    HOMEID: 2,
                    BANKREL: "9900",
                    OWNID: "9000",
                    TBRINVEST: 0,
                    TBREDU: 0,
                    TBRBUSS: 1,
                    TBRCAPITAL: 0,
                    TBROTHER: "",
                    TXMAIN: 1,
                    TAXID: 2,
                    NIP: "201103379",
                    MAINSALID: "01",
                    ADDR: "DUMMY DATA",
                    RT: "02",
                    RW: "13",
                    KELNM: "DUMMY DATA",
                    KECNM: "DUMMY DATA",
                    PROVID: "01",
                    CITYID: "0111",
                    POSTALCD: "40394",
                    COUNTRYID: "ID",
                    AREACODE: "022",
                    PHONENBR: "750750750",
                    NOFAX: "02200200000",
                    JOBID: "007",
                    DTSTARTJOB: "2014-01-01",
                    FUNCJOB: "3",
                    NOTEFUNC: "DUMMY DATA",
                    OTHERINFO: "01",
                    STSJOB: 1,
                    BUSSID: "9990",
                    NOTEBUS: "DUMMY DATA",
                    NMJOB: "03",
                    COMNMJOB: "DUMMY DATA",
                    NOTECOMNM: "DUMMY DATA",
                    ADDRJOB: "DUMMY DATA",
                    POSTALCODEJOB: "00100",
                    LOCJOB: "1",
                    EMAILJOB: "xx@xx.com",
                    NOTELPJOB: "021-1234567"
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.statusId === 1) {
                await NasabahService.updateNasabah(id, {
                    nocif: response.data.result.CIFID
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

    static async trx(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                user
            } = req;
            const nasabah = await NasabahService.getNasabahCustom(id);
            const date = moment().add(12, 'h');
            const auth = crypto.createHmac('sha1', userGtw.v2).update(functionId.trx + gateway + date.format('YYYY-MM-DDHH:mm:ss')).digest('hex');
            const response = await axios.post(coreUrl.v2, {
                authKey: auth,
                reqId: functionId.trx,
                txDate: date.format('YYYYMMDD'),
                txHour: date.format('HHmmss'),
                userGtw: userGtw.v2,
                channelId: channel.v2,
                corpId: "005",
                prodId: "01",
                date: "29-07-2019",
                date_rk: "29-07-2019",
                branchId: "530",
                txCcy: "IDR",
                nbrOfAcc: "2",
                totalAmount: "100000",
                prosesId: "prc01",
                userId: "k0229",
                spvId: "",
                revSts: "0",
                txType: "O",
                refAcc: "",
                param: [{
                        accNbr: nasabah.kd_cab + trxAcc,
                        dbCr: 0,
                        refAcc: "",
                        txAmt: 100000,
                        txCode: "199",
                        txMsg: "Keterangan Transaksi OB Debet",
                        isFee: 0
                    },
                    {
                        accNbr: nasabah.newrek,
                        dbCr: 1,
                        refAcc: "",
                        txAmt: 100000,
                        txCode: "299",
                        txMsg: "Keterangan Transaksi OB Kredit",
                        isFee: 0
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.statusId === 1) {
                await NasabahService.updateNasabah(id, {
                    nocif: response.data.result.CIFID
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

    static async inquiryCIF(req, res) {
        const {
            nama_nsb,
            tgl_lahir
        } = req.query;
        try {
            const body = encodeURIComponent(`FULLNM=${nama_nsb};BRTDT=${tgl_lahir}`);
            const response = await axios.get(`${coreUrl.v1.get}?channelid=${channel.v1}&userGtw=${userGtw.v1}&id=${functionId.inquiryCIF}&input=${body}`);

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
            const response = await axios.get(`${coreUrl.v1.set}?channelid=${channel.v1}&userGtw=${userGtw.v1}&id=${functionId.updateCIF}&input=${body}`);

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
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};APPLID=02;PRODID=${nasabah.jenis_tabungan.slice(-2)};SVGTYPE=${nasabah.jenis_tabungan.slice(-2) === '52' ? '032' : '021'};USERID=${user.username}`);
            const response = await axios.get(`${coreUrl.v1.set}?channelid=${channel.v1}&userGtw=${userGtw.v1}&id=${functionId.createTabungan}&input=${body}`);

            if (response.data.STATUS === 1) {
                await NasabahService.updateNasabah(id, {
                    newrek: response.data.ACCNBR
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
            const response = await axios.get(coreUrl.v1.set, null, {
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