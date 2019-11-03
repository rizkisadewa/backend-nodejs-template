import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';

const local = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathToFile = path.join(path.resolve(), `public/uploads/${file.fieldname}`);
        fs.mkdirsSync(pathToFile);
        cb(null, pathToFile);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Berkas harus berupa gambar';
        return cb(null, false);
    }

    cb(null, true);
};

const upload = multer({
    storage: local,
    fileFilter: imageFilter
});

export default upload;