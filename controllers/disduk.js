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
const requestIp = require('request-ip');

const resUtil = new ResponseUtil();

class DisdukController {
    static async callNIK(req, res) {
        const {
            nik,
            username
        } = req.params;

        const ip = requestIp.getClientIp(req);
        const clientIp = req.connection.remoteAddress;

        if (!Number(nik)) {
            resUtil.setError(error.response.status, 'NIK harus bernilai angka');
            return resUtil.send(res);
        }

        try {

            console.log("Server IP : "+ip);
            console.log("Client IP : "+clientIp);
            console.log("Username : "+username);
            const response = await axios.post(nikUrl, {
                nik: nik,
                user_id: userId,
                password: password,
                IP_USER: username
            }, {
                headers: {
                    Authorization: `Bearer ${nikToken}`,
                    'Content-Type': 'application/json'
                }
            });

            resUtil.setSuccess(response.status, response.statusText, response.data);
            return resUtil.send(res);
            console.log(response.data);
            console.log(response);
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

    static async getIpClient(req, res){
        const ip = requestIp.getClientIp(req);

        try{
          resUtil.setSuccess(200, 'IP Client berhasil ditampilkan');
          res.send(JSON.stringify(ip));
        } catch (error) {
          if (error.errors) {
              resUtil.setError(400, error.errors[0].message);
          } else {
              resUtil.setError(400, error);
          }
          return resUtil.send(res);
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
