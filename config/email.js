export const smtp_server = '10.30.246.245'; // 'email.bjbs.co.id';
export const smtp_auth_username = 'tabungan.ibmaslahah@bjbs.co.id';
export const smtp_auth_password = 'Bjbs2019!';
export const smtp_port = '25';
export const smtp_sender = 'tabungan.ibmaslahah@bjbs.co.id';
export function emailNasabah(param) {
    const rupiah = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(param.setoran_awal);
    return `Yth.${param.nama_nsb} Kartu Maslahah Anda telah aktif dengan No Rekening ${param.newrek} dan Saldo ${rupiah} Terima kasih, Salam Maslahah.`;
}
