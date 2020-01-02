import fs from 'fs-extra';
import sharp from 'sharp';

function getDestination(req, file, cb) {
    cb(null, '/dev/null')
}

class MyCustomStorage {
    constructor(opts) {
        this.getDestination = (opts.destination || getDestination);
    }
    _handleFile(req, file, cb) {
        this.getDestination(req, file, function (err, path) {
            if (err)
                return cb(err);
            var outStream = fs.createWriteStream(path);
            var resizer = sharp().resize(300, undefined).jpeg();
            file.stream.pipe(resizer).pipe(outStream);
            outStream.on('error', cb);
            outStream.on('finish', function () {
                cb(null, {
                    path: path,
                    size: outStream.bytesWritten
                });
            });
        });
    }
    _removeFile(req, file, cb) {
        fs.unlink(file.path, cb);
    }
}

module.exports = function (opts) {
    return new MyCustomStorage(opts)
}