import axios from "axios";
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';
import {
    baseUrl,
    channelId,
    eventId,
    serviceId,
    templateSO,
    templateM,
    templateN
} from '../config/sms';
import UserService from '../services/user';
import NasabahService from '../services/nasabah';

const resUtil = new ResponseUtil();

class SMSController {
    static async sendSMS(req, res) {
        //{
        // message : xxx
        // nomor : xxx
        //}
        const smsBodyReq = emptyStringsToNull(req.body);
        const messageEncode = encodeURIComponent(smsBodyReq.message);

        try {
            const response = await axios.get(baseUrl, {
                params: {
                    event_id: eventId,
                    service_id: serviceId,
                    channel_id: channelId,
                    message: messageEncode,
                    msisdn: smsBodyReq.nomor
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

    static async notifSO(req, res) {
        const {
            kode_cabang
        } = req.user;
        try {
            const messageEncode = encodeURIComponent(templateSO);
            const nomor = await UserService.getNomorSO(kode_cabang);
            const response = await axios.get(`${baseUrl}?event_id=${eventId}&service_id=${serviceId}&channel_id=${channelId}&message=${messageEncode}&msisdn=${nomor}`);

            resUtil.setSuccess(response.status, `Kirim sms ke nomor: ${nomor}`, response.data);
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

    static async notifApprove(req, res) {
        const {
            query
        } = req;
        try {
            const messageEncode1 = encodeURIComponent(templateM);
            const nomor1 = await UserService.getNomor(query.kode);
            const response1 = await axios.get(`${baseUrl}?event_id=${eventId}&service_id=${serviceId}&channel_id=${channelId}&message=${messageEncode1}&msisdn=${nomor1}`);

            const messageEncode2 = encodeURIComponent(templateN);
            const nomor2 = await NasabahService.getNomor(query.nasabah);
            const response2 = await axios.get(`${baseUrl}?event_id=${eventId}&service_id=${serviceId}&channel_id=${channelId}&message=${messageEncode2}&msisdn=${nomor2}`);

            if (response1.data.code === 1 && response2.data.code === 1) {
                resUtil.setSuccess(200, `Kirim sms ke nomor Marketing: ${nomor1} & nomor Nasabah: ${nomor2}`);
                return resUtil.send(res);
            } else {
                resUtil.setError(400, `Salah satu sms ada yg tidak terkirim`);
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

    static async notifM(req, res) {
        const {
            query
        } = req;
        try {
            const messageEncode = encodeURIComponent(templateM);
            const nomor = await UserService.getNomor(query.kode);
            const response = await axios.get(`${baseUrl}?event_id=${eventId}&service_id=${serviceId}&channel_id=${channelId}&message=${messageEncode}&msisdn=${nomor}`);

            resUtil.setSuccess(response.status, `Kirim sms ke nomor: ${nomor}`, response.data);
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

    static async notifN(req, res) {
        const {
            query
        } = req;
        try {
            const messageEncode = encodeURIComponent(templateN);
            const nomor = await NasabahService.getNomor(query.nasabah);
            const response = await axios.get(`${baseUrl}?event_id=${eventId}&service_id=${serviceId}&channel_id=${channelId}&message=${messageEncode}&msisdn=${nomor}`);

            resUtil.setSuccess(response.status, `Kirim sms ke nomor: ${nomor}`, response.data);
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
export default SMSController;