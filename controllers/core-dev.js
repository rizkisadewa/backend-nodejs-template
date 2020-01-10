import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import ResponseUtil from '../utils/response';
import {
    userGtw,
    gateway,
    channel,
    baseUrl as coreUrl,
    functionId,
    trxAcc,
    proswitching
} from '../config/core';
const curl = new(require('curl-request'))();

const resUtil = new ResponseUtil();

class CoreDeveloperController {
  static async trx(req, res) {
      try {

          const date = moment();

          const auth = crypto.createHmac('sha1', userGtw.v2).update(functionId.trx + gateway + date.format('YYYY-MM-DDHH:mm:ss')).digest('hex');
          const total_amount = req.body.amount;
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
              branchId: req.body.kode_cabang,
              txCcy: "IDR",
              nbrOfAcc: "2",
              totalAmount: total_amount,
              prosesId: "prc01",
              userId: req.body.kd_operator,
              spvId: "",
              revSts: "0",
              txType: "O",
              refAcc: "",
              param: [{
                      accNbr: req.body.accNbrDebet,
                      dbCr: 0,
                      refAcc: "",
                      txAmt: total_amount,
                      txCode: "199",
                      txMsg: "Keterangan Transaksi OB Debet",
                      isFee: 0
                  },
                  {
                      accNbr: req.body.accNbrCredit,
                      dbCr: 1,
                      refAcc: "",
                      txAmt: total_amount,
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

          // log
          console.log("******DATA INPUT**********");
          console.log("kode_cabang: "+req.body.kode_cabang+"\n"+
	                    "amount"+req.body.ammount+"\n"+
	                    "kd_operator"+req.body.kd_operator+"\n"+
	                    "accNbrDebet"+req.body.accNbrDebet+"\n"+
	                    "accNbrCredit"+req.body.accNbrCredit);
          console.log("******DATA INPUT**********");
          console.log("**********TRANSACTION DEVELOPER API**********");
          console.log(response.data);
          console.log("*********************************************");

          resUtil.setSuccess(response.status, response.statusText, response.data, response);
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
              console.log(error);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
          }
          console.log(error.config);
      }
  }
}

export default CoreDeveloperController;
