import axios from 'axios';
import querystring from 'querystring';
import ResponseUtil from '../utils/response';
import {
    userId,
    password,
    userIP,
    nikUrl,
    nikToken,
    balikanUrl,
    balikanToken,
    idLembaga,
    namaLembaga
} from '../config/disduk';

const resUtil = new ResponseUtil();

class DisdukController {
    static async callNIK(req, res) {
        const {
            nik
        } = req.params;

        if (!Number(nik)) {
            resUtil.setError(400, 'NIK harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const response = await axios.post(nikUrl, {
                nik: nik,
                user_id: userId,
                password: password,
                IP_USER: userIP
            }, {
                headers: {
                    Authorization: `Bearer ${nikToken}`,
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

    static async dataBalikan(req, res) {
        const {
            nik,
            nocif,
            handphone,
            nama_nsb
        } = req.body;

        try {
            const formData = querystring.stringify({
                nik: nik,
                id_lembaga: idLembaga,
                nama_lembaga: namaLembaga,
                param: [{
                    NO_CIF: nocif,
                    NO_HP: handphone,
                    NAMA: nama_nsb
                }]
            });
            const response = await axios.post(balikanUrl.store, formData, {
                headers: {
                    Authorization: `Bearer ${balikanToken}`,
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
export default DisdukController;