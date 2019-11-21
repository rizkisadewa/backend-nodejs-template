import AuthController from '../controllers/auth';
import CoreController from '../controllers/core';
import CabangController from '../controllers/cabang';
import UserTypeController from '../controllers/user-type';
import UserController from '../controllers/user';
import NasabahController from '../controllers/nasabah';
import UploadController from '../controllers/upload';
import upload from '../utils/upload';
import MasterController from '../controllers/master';
import DisdukController from '../controllers/disduk';
import SMSController from '../controllers/sms'

export default (app) => {
    // API routes Auth
    app.post('/api/auth/sign-in', AuthController.validate('sign-in'), AuthController.signIn);
    app.get('/api/auth/verify', AuthController.verifyJwt, function (req, res) {
        res.json({ status: 'success', message: 'Token Valid', data: req.user });
    });

    // API routes Disduk
    app.get('/api/disduk/call-nik', AuthController.verifyJwt, DisdukController.callNIK);

    // API routes Core
    app.get('/api/core/create-cif-perorangan', AuthController.verifyJwt, CoreController.createCIFPerorangan);
    app.post('/api/core/create-cif/:id', AuthController.verifyJwt, CoreController.createCIF);
    app.post('/api/core/update-cif/:id', AuthController.verifyJwt, CoreController.updateCIF);
    app.post('/api/core/create-tabungan/:id', AuthController.verifyJwt, CoreController.createTabungan);
    app.post('/api/core/card-activate/:id', AuthController.verifyJwt, CoreController.cardActivate);

    // API routes Cabang
    app.get('/api/cabang', CabangController.getAllCabangs);
    app.post('/api/cabang', CabangController.addCabang);
    app.get('/api/cabang/:id', CabangController.getCabang);
    app.put('/api/cabang/:id', CabangController.updateCabang);
    app.delete('/api/cabang/:id', CabangController.deleteCabang);

    // API routes User Type
    app.get('/api/user-type', UserTypeController.getAllUserTypes);
    app.post('/api/user-type', UserTypeController.addUserType);
    app.get('/api/user-type/:id', UserTypeController.getUserType);
    app.put('/api/user-type/:id', UserTypeController.updateUserType);
    app.delete('/api/user-type/:id', UserTypeController.deleteUserType);

    // API routes User
    app.get('/api/user', UserController.getAllUsers);
    app.post('/api/user', UserController.addUser);
    app.get('/api/user/:id', UserController.getUser);
    app.put('/api/user/:id', UserController.updateUser);
    app.delete('/api/user/:id', UserController.deleteUser);

    // API routes Nasabah
    // Custom routes get
    app.get('/api/nasabah/primary-data', AuthController.verifyJwt, NasabahController.getPrimaryData);
    app.get('/api/nasabah/primary-data/:id', AuthController.verifyJwt, NasabahController.getPrimaryData);
    app.get('/api/nasabah/secondary-data', AuthController.verifyJwt, NasabahController.getSecondaryData);
    app.get('/api/nasabah/nasabah-by-status', NasabahController.getAllNasabahByStatus);
    app.get('/api/nasabah/laporan-pembukaan-rekening', NasabahController.getAllNasabahLapPembRek);

    // Custon routes post
    app.post('/api/nasabah/save-primary-data', AuthController.verifyJwt, upload.any(), NasabahController.validate('primary-data'), NasabahController.savePrimaryData);
    app.post('/api/nasabah/save-primary-data/:id', AuthController.verifyJwt, upload.any(), NasabahController.validate('primary-data'), NasabahController.savePrimaryData);
    app.post('/api/nasabah/save-secondary-data/:id', AuthController.verifyJwt, NasabahController.validate('secondary-data'), NasabahController.saveSecondaryData);
    app.post('/api/nasabah/send-request-data/:id', AuthController.verifyJwt, NasabahController.sendRequestData);
    app.post('/api/nasabah/approve-primary/:id', NasabahController.approveReqNewData);
    app.post('/api/nasabah/reject-primary/:id', NasabahController.rejectReqNewData);
    app.post('/api/nasabah/approve-secondary/:id', NasabahController.approveReqUpdateData);
    app.post('/api/nasabah/reject-secondary/:id', NasabahController.rejectReqUpdateData);

    // Normal routes
    app.get('/api/nasabah', NasabahController.getAllNasabahs);
    app.post('/api/nasabah', NasabahController.addNasabah);
    app.get('/api/nasabah/:id', NasabahController.getNasabah);
    app.put('/api/nasabah/:id', NasabahController.updateNasabah);
    app.delete('/api/nasabah/:id', NasabahController.deleteNasabah);
    app.get('/api/nasabah/laporan-pembukaan-rekening', NasabahController.getAllNasabahLapPembRek); // Laporan Pembukaan Rekening
    app.get('/api/nasabah/laporan-pembukaan-rekening/export-preview-page/:tgl_awal/:tgl_akhir', NasabahController.getReportPembukaanRekeningData); // Laporan Pembukaan Rekening Export Preview


    // API routes file process
    app.post('/api/uploads', AuthController.verifyJwt, upload.single('image'), UploadController.singleImage);

    // API routes Master
    app.post('/api/master', MasterController.validate(), MasterController.get);

    // API routes SMS
    app.post('/api/send-sms', SMSController.sendSMS);
    app.get('/api/sms/notif-so', AuthController.verifyJwt, SMSController.notifSO);
    app.get('/api/sms/notif-m', AuthController.verifyJwt, SMSController.notifM);
    app.get('/api/sms/notif-n', AuthController.verifyJwt, SMSController.notifN);
};
