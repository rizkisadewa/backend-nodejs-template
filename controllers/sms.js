import axios from "axios";
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';

const resUtil = new ResponseUtil();
const BASE_URL = 'http://172.31.250.90:8080/MaslahahJSONGateway/JSON?event_id=mdm.dev.10111701&service_id=100016&channel_id=1000019&';


class SMSController {
    
    static async sendSMS(req, res) {

        //{
        // message : xxx
        // nomor : xxx
        //}
        const smsBodyReq = emptyStringsToNull(req.body);
        let messageEncode = encodeURIComponent(smsBodyReq.message);

        try {
            const response = await axios.get(BASE_URL + `message=${messageEncode}&msisdn=${smsBodyReq.nomor}`);

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
export default SMSController;


