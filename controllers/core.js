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
const curl = new(require('curl-request'))();

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
                    AOID: user.aoid,
                    NPWP: "698930484444000",
                    TXCASH: nasabah.setoran_awal,
                    TYPEID: "1",
                    IDNBR: nasabah.no_identitas,
                    EXPDT: nasabah.no_identitas_exp,
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
                date: date.format('DD-MM-YYYY'),
                date_rk: date.format('DD-MM-YYYY'),
                branchId: user.kode_cabang,
                txCcy: "IDR",
                nbrOfAcc: "2",
                totalAmount: nasabah.setoran_awal,
                prosesId: "prc01",
                userId: user.username,
                spvId: "",
                revSts: "0",
                txType: "O",
                refAcc: "",
                param: [{
                        accNbr: nasabah.kd_cab + trxAcc,
                        dbCr: 0,
                        refAcc: "",
                        txAmt: nasabah.setoran_awal,
                        txCode: "199",
                        txMsg: "Keterangan Transaksi OB Debet",
                        isFee: 0
                    },
                    {
                        accNbr: nasabah.newrek,
                        dbCr: 1,
                        refAcc: "",
                        txAmt: nasabah.setoran_awal,
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
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};CIFTYPE=0;FULLNM=${nasabah.nama_nsb};SURENM=${nasabah.nama_singkat};ADDRESS=${nasabah.alamat_ktp};CITY=${nasabah.kota};POSTALCD=${nasabah.kode_pos};GENDER=${nasabah.jns_kelamin};RELIGION=${nasabah.kode_agama};BRTDT=${moment(nasabah.tgl_lahir).format('DD-MM-YYYY')};BRTPLACE=${nasabah.tempat_lahir};IDTYPE=${nasabah.kd_identitas};IDNBR=${nasabah.no_identitas};INCOME=${nasabah.penghasilan};MOTHERNM=${nasabah.nama_ibu};RT=${nasabah.rt};RW=${nasabah.rw};PROVID=${nasabah.provinsi};NPWP=${nasabah.npwp};AREACODE=${nasabah.kode_area};PHONENBR=${nasabah.telp_rumah};NOHP=${nasabah.handphone};EMAIL=${nasabah.email};GRADE=${nasabah.pendidikan_text};HOBI=${nasabah.hobby};MARRIAGEID=${nasabah.sts_nikah};JOBID=${nasabah.pekerjaan};COMPNM=${nasabah.nama_prs};COMPADDR=${nasabah.alamat_prs};AVGTXDAILY=${nasabah.rata_akt_daily};EXPIDEN=${moment(nasabah.no_identitas_exp).format('DD-MM-YYYY')};USERID=${user.username}`);
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

    static async updateCIFPerorangan(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                user
            } = req;
            const nasabah = await NasabahService.getNasabahCustom(id);
            const date = moment().add(12, 'h');
            const auth = crypto.createHmac('sha1', userGtw.v2).update(functionId.updateCIFPerorangan + gateway + date.format('YYYY-MM-DDHH:mm:ss')).digest('hex');
            const response = await axios.post(coreUrl.v2, {
                authKey: auth,
                reqId: functionId.updateCIFPerorangan,
                txDate: date.format('YYYYMMDD'),
                txHour: date.format('HHmmss'),
                userGtw: userGtw.v2,
                channelId: channel.v2,
                param: {
                    CIFID: nasabah.nocif,
                    BRANCHID: nasabah.kd_cab,
                    BRTDT: moment(nasabah.tgl_lahir).format('DD-MM-YYYY'),
                    NOHP: `+${nasabah.handphone}`,
                    CIFTYPE: 0,
                    FULLNM: nasabah.nama_nsb,
                    SURENM: nasabah.nama_singkat,
                    MOTHRNM: nasabah.nama_ibu,
                    ALIAS: nasabah.nama_singkat,
                    SEX: nasabah.jns_kelamin,
                    RELIGIONID: nasabah.kode_agama,
                    BRTPLACE: nasabah.tempat_lahir,
                    HOBBY: nasabah.hobby,
                    POSTDEGREE: nasabah.pendidikan_text,
                    MARRIAGEID: parseInt(nasabah.sts_nikah),
                    BLOODTYPE: "O",
                    TXTRF: nasabah.rata_akt_daily,
                    USERID: user.username,
                    AOID: user.aoid,
                    NPWP: nasabah.npwp,
                    TXCASH: nasabah.setoran_awal,
                    TYPEID: nasabah.kd_identitas,
                    IDNBR: nasabah.no_identitas,
                    EXPDT: nasabah.no_identitas_exp,
                    LASTEDUID: nasabah.pendidikan,
                    INSURED: 0,
                    HOMEID: 2,
                    BANKREL: nasabah.hubank,
                    OWNID: "9000",
                    TBRINVEST: 0,
                    TBREDU: 0,
                    TBRBUSS: 1,
                    TBRCAPITAL: 0,
                    TBROTHER: "",
                    TXMAIN: 1,
                    TAXID: 2,
                    NIP: "9999999",
                    MAINSALID: "01",
                    ADDR: nasabah.alamat_ktp,
                    RT: nasabah.rt,
                    RW: nasabah.rw,
                    KELNM: nasabah.kelurahan,
                    KECNM: nasabah.kecamatan,
                    PROVID: nasabah.provinsi,
                    CITYID: nasabah.kota,
                    POSTALCD: nasabah.kode_pos,
                    COUNTRYID: "ID",
                    AREACODE: nasabah.kode_area,
                    PHONENBR: nasabah.telp_rumah,
                    NOFAX: "99999999",
                    JOBID: nasabah.pekerjaan,
                    DTSTARTJOB: "2014-01-01",
                    FUNCJOB: nasabah.jabatan,
                    NOTEFUNC: "DUMMY DATA",
                    OTHERINFO: "01",
                    STSJOB: 1,
                    BUSSID: nasabah.usaha,
                    NOTEBUS: "DUMMY DATA",
                    NMJOB: "03",
                    COMNMJOB: "DUMMY DATA",
                    NOTECOMNM: "DUMMY DATA",
                    ADDRJOB: nasabah.alamat_prs,
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

    static async createTabunganNew(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                user
            } = req;
            const nasabah = await NasabahService.getNasabahCustom(id);
            const date = moment().add(12, 'h');
            const auth = crypto.createHmac('sha1', userGtw.v2).update(functionId.createTabunganNew + gateway + date.format('YYYY-MM-DDHH:mm:ss')).digest('hex');
            const response = await axios.post(coreUrl.v2, {
                authKey: auth,
                reqId: functionId.createTabunganNew,
                txDate: date.format('YYYYMMDD'),
                txHour: date.format('HHmmss'),
                userGtw: userGtw.v2,
                channelId: channel.v2,
                BRANCHID: nasabah.kd_cab,
                PRODID: nasabah.jenis_tabungan.slice(-2),
                CIFID: nasabah.nocif,
                CRTUSER: user.username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.statusId === 1) {
                await NasabahService.updateNasabah(id, {
                    newrek: response.data.result.ACCNBR
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

    static async createTabungan(req, res) {
        const {
            id
        } = req.params;
        const {
            user
        } = req;
        try {
            const nasabah = await NasabahService.getNasabah(id);
            // const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};APPLID=02;PRODID=${nasabah.jenis_tabungan.slice(-2)};SVGTYPE=${nasabah.jenis_tabungan.slice(-2) === '52' ? '029' : '021'};USERID=${user.username}`);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};APPLID=02;PRODID=${nasabah.jenis_tabungan.slice(-2)};SVGTYPE=021;USERID=${user.username}`); // Hardcode
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
            const nasabah = await NasabahService.getNasabah(id);
            const body = encodeURIComponent(`BRANCHID=${nasabah.kd_cab};CIFID=${nasabah.nocif};ACCNBR=${nasabah.newrek};FULLNM=${nasabah.nama_nsb};SURENM=${nasabah.nama_singkat};SVGTYPE=021;CARDNO=${nasabah.no_kartu}`);
            const url = `http://172.31.201.5:49006?channelid=${channel.v1}&userGtw=${userGtw.v1}&id=${functionId.cardActivate}&input=${body}`;

            curl.setHeaders([
                    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
                ])
                .get(url)
                .then(({
                    statusCode,
                    body,
                    headers
                }) => {
                    console.log(statusCode, body, headers);
                    resUtil.setSuccess(statusCode, "OK", body);
                    return resUtil.send(res);
                })
                .catch((e) => {
                    console.log(e);
                    resUtil.setSuccess(400, "Error", e);
                    return resUtil.send(res);
                });
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

    static async inquiryCard(req, res) {
        const {
            cardno
        } = req.query;
        try {
            const body = encodeURIComponent(`CARDNO=${cardno}`);
            const url = `http://172.31.201.5:49006?channelid=${channel.v1}&userGtw=${userGtw.v1}&id=${functionId.inquiryCard}&input=${body}`;

            curl.setHeaders([
                    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
                ])
                .get(url)
                .then(({
                    statusCode,
                    body,
                    headers
                }) => {
                    console.log(statusCode, body, headers);
                    resUtil.setSuccess(statusCode, "OK", body);
                    return resUtil.send(res);
                })
                .catch((e) => {
                    console.log(e);
                    resUtil.setSuccess(400, "Error", e);
                    return resUtil.send(res);
                });
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