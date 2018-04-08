const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const assetsFolder = 'product_images/';
    if (!fs.existsSync(assetsFolder)) {
      fs.mkdirSync(path.resolve(assetsFolder));
    }
    cb(null, assetsFolder);
  },
  filename(req, file, cb) {
    const extension = mime.extension(file.mimetype);
    const _fileName = req.body.name
      .split(' ')
      .join('_')
      .toLowerCase();

    const savedFileName = `${Date.now()}_${_fileName}.${extension}`;
    cb(null, savedFileName);
  }
});

const upload = multer({ storage });

const productUploadHandler = upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

module.exports = productUploadHandler;
