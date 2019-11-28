export const baseUrl = 'http://172.31.250.90:8080/MaslahahJSONGateway/JSON';
export const eventId = 'mdm.dev.10111701';
export const serviceId = '100016';
export const channelId = '1000019';
export const templateSO = 'Demo SMS untuk SO';
export const templateM = 'Demo SMS untuk Marketing';
export const templateN = 'Demo SMS untuk Nasabah';
export function smsNasabah(param) {
    const rupiah = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(param.setoran_awal);
    return `Yth.${param.nama_nsb} Kartu Maslahah Anda telah aktif dengan No Rekening ${param.newrek} dan Saldo ${rupiah} Terima kasih, Salam Maslahah.`;
}