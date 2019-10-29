import AuthController from '../controllers/auth';
import CoreController from '../controllers/core';
import CabangController from '../controllers/cabang';
import UserTypeController from '../controllers/user-type';
import UserController from '../controllers/user';
import UploadController from '../controllers/upload';
import upload from '../utils/upload';
import MasterController from '../controllers/master';

export default (app) => {
    // API routes Auth
    app.post('/api/auth/sign-in', AuthController.validate('sign-in'), AuthController.signIn);
    app.get('/api/auth/verify', AuthController.verifyJwt, function (req, res) {
        res.send(req.user);
    });

    // API routes Core
    app.post('/api/core/get-cif-by-id', AuthController.verifyJwt, CoreController.getCIFById);
    app.post('/api/core/get-cif-by-account', AuthController.verifyJwt, CoreController.getCIFByAccount);
    app.post('/api/core/create-cif-perorangan', AuthController.verifyJwt, CoreController.createCIFPerorangan);
    app.post('/api/core/create-cif-non-perorangan', AuthController.verifyJwt, CoreController.createCIFNonPerorangan);

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

    // API routes file process
    app.post('/api/uploads', AuthController.verifyJwt, upload.single('image'), UploadController.singleImage);

    // API routes Master
    app.get('/api/master', MasterController.validate(), MasterController.get);
};