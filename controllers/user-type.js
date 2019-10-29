import UserTypeService from '../services/user-type';
import ResponseUtil from '../utils/response';
import {
    emptyStringsToNull
} from '../utils/utilities';

const resUtil = new ResponseUtil();

class UserTypeController {
    static async getAllUserTypes(req, res) {
        try {
            const allUserTypes = await UserTypeService.getAllUserTypes();

            if (allUserTypes.length > 0) {
                resUtil.setSuccess(200, 'Data User Type berhasil ditampilkan', allUserTypes);
            } else {
                resUtil.setSuccess(200, 'Data User Type kosong');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async addUserType(req, res) {
        const newUserType = emptyStringsToNull(req.body);
        try {
            const createdUserType = await UserTypeService.addUserType(newUserType);
            resUtil.setSuccess(201, 'User Type berhasil ditambahkan', createdUserType);
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

    static async updateUserType(req, res) {
        const alteredUserType = emptyStringsToNull(req.body);
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User Type harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const updateUserType = await UserTypeService.updateUserType(id, alteredUserType);

            if (!updateUserType) {
                resUtil.setError(404, `User Type dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'User Type berhasil diubah', updateUserType);
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

    static async getUserType(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User Type harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const group = await UserTypeService.getUserType(id);

            if (!group) {
                resUtil.setError(404, `User Type dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'User Type berhasil ditampilkan', group);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static async deleteUserType(req, res) {
        const {
            id
        } = req.params;

        if (!Number(id)) {
            resUtil.setError(400, 'id User Type harus bernilai angka');
            return resUtil.send(res);
        }

        try {
            const deleteUserType = await UserTypeService.deleteUserType(id);

            if (!deleteUserType) {
                resUtil.setError(404, `User Type dengan id: ${id} tidak ditemukan`);
            } else {
                resUtil.setSuccess(200, 'User Type berhasil dihapus');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }
}
export default UserTypeController;