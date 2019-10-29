import MasterService from '../services/master';
import ResponseUtil from '../utils/response';
import {
    body,
    validationResult
} from 'express-validator';

const resUtil = new ResponseUtil();

class MasterController {
    static async get(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw errors.array()[0].msg;
            }

            const table = req.body;

            const master = await MasterService.get(table);

            if (master) {
                resUtil.setSuccess(200, 'Data Master berhasil ditampilkan', master);
            } else {
                resUtil.setError(400, 'Data Master kosong / tidak ditemukan');
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static validate() {
        return [
            body('table_id').not().isEmpty().withMessage('Id tabel harus diisi'),
            body('value_id').not().isEmpty().withMessage('Kolom tabel untuk value harus diisi'),
            body('text_id').not().isEmpty().withMessage('Kolom tabel untuk text harus diisi'),
            body('param_id').custom((value, {
                req
            }) => {
                const {
                    param_value
                } = req.body;
                if (value && !param_value) {
                    throw new Error('Nilai tabel untuk param harus diisi');
                }

                return true;
            }),
            body('sort_id').custom((value, {
                req
            }) => {
                const {
                    sort_value
                } = req.body;
                if (value && !sort_value) {
                    throw new Error('Nilai tabel untuk sort harus diisi (asc / desc)');
                }

                return true;
            })
        ]
    }
}
export default MasterController;