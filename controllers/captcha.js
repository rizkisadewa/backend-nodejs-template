import ResponseUtil from '../utils/response';
import svgCaptcha  from 'svg-captcha';


const resUtil = new ResponseUtil();

class CaptchaController {
    static async getCaptcha(req, res) {
    
        try {
           
            var captcha = svgCaptcha.create();
            resUtil.setSuccess(200, 'Success', captcha);
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
export default CaptchaController;