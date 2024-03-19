const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resoucre_type: "auto",
};

module.exports = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (err, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      console.log(err.message);
      return reject({ message: err.message });
    });
  });
};
