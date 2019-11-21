import UserService from '../services/user';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';
import {
    body,
    validationResult
} from 'express-validator';
import moment from 'moment';
import fs from 'fs-extra';
import path from 'path';
import base64Img from 'base64-img';

const resUtil = new ResponseUtil();

class UserController {
    static async getAllUsers(req, res) {
        try {
            const allUsers = await UserService.getAllUsers();

            if (allUsers.length > 0) {
                resUtil.setSuccess(200, 'Data User berhasil ditampilkan', allUsers);
            } else {
                resUtil.setSuccess(200, 'Data User kosong');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async addUser(req, res) {
        try {

            const errors = validationResult(req);
            const errorFile = req.fileValidationError;

            if (!errors.isEmpty()) {
                throw errors.array()[0].msg;
            }

            if (errorFile) {
                throw errorFile;
            }

            let newUser = emptyStringsToNull(req.body);
            const files = req.files;

            newUser.foto = `${files[0].fieldname}/${files[0].originalname}`;

            const createdUser = await UserService.addUser(newUser);
            resUtil.setSuccess(201, 'User berhasil ditambahkan', createdUser);
            return resUtil.send(res);

        } catch (error) {
            if (error.errors) {
                resUtil.setError(400, error.errors[0].message);
            } else {
                resUtil.setError(400, error);
            }
            return resUtil.send(res);
        }
    }

    static async updateUser(req, res) {
        const alteredUser = emptyStringsToNull(req.body);
        alteredUser.modified = moment().format('YYYY-MM-DD HH:mm:ss');
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const updateUser = await UserService.updateUser(id, alteredUser);

            if (!updateUser) {
                resUtil.setError(404, `User dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'User berhasil diubah', updateUser);
            }

            return resUtil.send(res);
        } catch (error) {
            if (error.errors) {
                resUtil.setError(400, error.errors[0].message);
            } else {
                resUtil.setError(400, error);
            }
            return resUtil.send(res);
        }
    }

    static async getUser(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const user = await UserService.getUser(id);

            if (!user) {
                resUtil.setError(404, `User dengan id: ${id} tidak ditemukan`);
            } else {
                const file = path.join(path.resolve(), `public/uploads/${user.foto}`);
                if (fs.existsSync(file)) {
                    user.foto = base64Img.base64Sync(file);
                } else {
                    user.foto = null;
                }
                resUtil.setSuccess(200, 'User berhasil ditampilkan', user);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async deleteUser(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const deleteUser = await UserService.deleteUser(id);

            if (!deleteUser) {
                resUtil.setError(404, `User dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'User berhasil dihapus');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async saveUser(req, res) {
        try {
            const errors = validationResult(req);
            const errorFile = req.fileValidationError;

            if (!errors.isEmpty()) {
                throw erros.array()[0].msg;
            }

            if (errorFile) {
                throw errorFile;
            }

            let userData = emptyStringsToNull(req.body);
            const files = req.files;

            if (files.length > 0)
                userData.foto = `${files[0].fieldname}/${files[0].originalname}`;

            const updatedUser = await UserService.updateUser(userData.id, userData);
            resUtil.setSuccess(201, 'User berhasil perbaharui', updatedUser);

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }

    }
}
export default UserController;