export const userGtw = {
  v1: 'GTW06',
  v2: 'jmlgw',
  v3: 'fosgw'
};
export const gateway =  '172.31.253.254'; // ip dev. in remark '172.31.251.245'; // ip prod. //
export const channel = {
  v1: '6',
  v2: '34',
  v3: '27'
};

// ip dev : 172.112.17.20
// ip prod : 172.112.17.102
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
  createTabunganNew: '00084',
  updateCIFPerorangan: '00103',
  inquiryCIF: '001',
  createCIF: '002',
  updateCIF: '003',
  createTabungan: '004',
  inquiryTabungan: '005',
  cardActivate: '006',
  inquiryCard: '007'
};
const accNumber = '2090747001';
export const trxAcc = '19' + accNumber + '360';


// Proswitcing
export const proswitching = {
  production_ip : "http://172.133.17.212",
  development_ip : "http://172.31.201.5"
}
