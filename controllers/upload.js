import ResponseUtil from '../utils/response';

const resUtil = new ResponseUtil();

class UploadController {
    static async singleImage(req, res) {
        try {
            const {
                fileValidationError,
                file
            } = req;
            if (fileValidationError) {
                resUtil.setError(400, fileValidationError);
            } else if (!file) {
                resUtil.setError(404, 'Harap pilih berkas gambar');
            } else {
                resUtil.setSuccess(200, 'Berkas gambar berhasil diunggah', file);
            }

            return resUtil.send(res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }
}
export default UploadController;