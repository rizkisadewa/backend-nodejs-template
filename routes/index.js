import AuthController from '../controllers/auth';
import UserTypeController from '../controllers/user-type';
import UserController from '../controllers/user';
import UploadController from '../controllers/upload';
import { upload } from '../utils/upload';
import MasterController from '../controllers/master';

export default (app) => {
    // API routes Auth
    app.post('/api/auth/sign-in', AuthController.validate('sign-in'), AuthController.signIn);
    app.get('/api/auth/verify', AuthController.verifyJwt, function (req, res) {
        res.json({ status: 'success', message: 'Token Valid', data: req.user });
    });

    // API routes User Type
    app.get('/api/user-type', UserTypeController.getAllUserTypes);
    app.post('/api/user-type', UserTypeController.addUserType);
    app.get('/api/user-type/:id', UserTypeController.getUserType);
    app.put('/api/user-type/:id', UserTypeController.updateUserType);
    app.delete('/api/user-type/:id', UserTypeController.deleteUserType);

    // API routes User
    // Custom routes get
    app.get('/api/user-dashboard', AuthController.verifyJwt, UserController.getDashboard);
    app.get('/api/user/custom/:id', UserController.getUserCustom);
    app.get('/api/all-user/custom', UserController.getAllUsersCustom);
    app.get('/api/user-profile/:username', UserController.getUserProfile);

    // Custom routes post
    app.post('/api/user/save', upload.any(), UserController.saveUser);
    app.post('/api/user/change-password/:id', AuthController.verifyJwt, UserController.changePassword);

    // Normal routes
    app.get('/api/user', UserController.getAllUsers);
    app.post('/api/user', upload.any(), UserController.addUser);
    app.get('/api/user/:id', UserController.getUser);
    app.put('/api/user/:id', UserController.updateUser);
    app.delete('/api/user/:id', UserController.deleteUser);

    // API routes file process
    app.post('/api/uploads', AuthController.verifyJwt, upload.single('image'), UploadController.singleImage);

    // API routes Master
    app.post('/api/master', MasterController.validate(), MasterController.get);

};
