import axios from 'axios';
import ResponseUtil from '../utils/response';

const resUtil = new ResponseUtil();
const BASE_URL = 'http://172.16.160.128:8000/dukcapil/get_json/BJB_SYARIAH/CALL_NIK';

class DisdukController {
    static async callNIK(req, res) {
        const {
            nik
        } = req.params;

        if (!Number(nik)) {
            resUtil.setError(400, 'Nomor Kartu Identitas harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const response = await axios.post(BASE_URL, {
                "nik": nik,
                "user_id": "1142324201907093INDRA",
                "password": "YlDIixkL",
                "IP_USER": "10.161.92.17"
            }, {
                headers: {
                    Authorization: 'Bearer ZWBLgHvVwHluqegtjCQ',
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