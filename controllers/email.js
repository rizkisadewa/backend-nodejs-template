import ResponseUtil from '../utils/response';
import nodeMailer from 'nodemailer';
import {
    emptyStringsToNull
} from '../utils/utilities';

import {
    smtp_server,
    smtp_auth_username,
    smtp_auth_password,
    smtp_port,
    smtp_sender,
    emailNasabah
} from '../config/email';
import NasabahService from '../services/nasabah';

const resUtil = new ResponseUtil();

class EmailController {

    static async sendEmail(req, res) {
        //{
        // to : xxx,
        // subject : xxx,
        // content : xxx
        //}
        const emailBodyReq = emptyStringsToNull(req.body);

        try {

            let transport = nodeMailer.createTransport({
                host: smtp_server,
                port: smtp_port,
                auth: {
                    user: smtp_auth_username,
                    pass: smtp_auth_password
                }
            });

            const message = {
                from: smtp_sender, // Sender address
                to: emailBodyReq.to, // List of recipients
                subject: emailBodyReq.subject, // Subject line
                html: emailBodyReq.content // Plain text body
            };

            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                    resUtil.setError(550, err);

                } else {

                    console.log(info);
                    resUtil.setSuccess(200, info, 'success');
                }
            });

            return resUtil.send(res);
        } catch (error) {

            resUtil.setError(550, error);
            return resUtil.send(res);

        }
    }

    static async notifN(req, res) {
        const {
            id
        } = req.query;
        try {
            const nasabah = await NasabahService.getNasabah(id);
            const body = emailNasabah(nasabah);
            let transport = nodeMailer.createTransport({
                host: smtp_server,
                port: smtp_port,
                auth: {
                    user: smtp_auth_username,
                    pass: smtp_auth_password
                }
            });

            const message = {
                from: smtp_sender, // Sender address
                to: nasabah.email, // List of recipients
                subject: 'Tabungan iB Maslahah Telah Aktif', // Subject line
                html: body // Plain text body
            };

            if (nasabah.email) {
                transport.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err)
                        resUtil.setError(550, err);

                    } else {

                        console.log(info);
                        resUtil.setSuccess(200, info, 'success');
                    }
                });
            } else {
                resUtil.setError(404, 'Email Nasabah belum terisi, gagal mengirim email.');
            }

            return resUtil.send(res);
        } catch (error) {

            resUtil.setError(550, error);
            return resUtil.send(res);

        }
    }
}
export default EmailController;