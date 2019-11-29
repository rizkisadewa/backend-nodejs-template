export const userGtw = {
  v1: 'GTW06',
  v2: 'fosgw'
};
export const gateway = '172.31.253.254';
export const channel = {
  v1: '6',
  v2: '27'
};
export const baseUrl = {
  v1: {
    set: 'http://172.112.17.20:7070/Gateway/gateway/services/setDataExt',
    get: 'http://172.112.17.20:7070/Gateway/gateway/services/getDataExt'
  },
  v2: 'http://172.112.17.20:7070/Gateway/service/v2/postData'
};
export const functionId = {
  createCIFPerorangan: '00103',
  trx: '00005',
  inquiryCIF: '001',
  createCIF: '002',
  updateCIF: '003',
  createTabungan: '004',
  cardActivate: '006'
};
const accNumber = '2090747001';
export const trxAcc = '19' + accNumber + '360';
