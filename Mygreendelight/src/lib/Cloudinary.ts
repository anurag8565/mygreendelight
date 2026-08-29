import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadoncloudinary = async (
  fileBuffer: Buffer
) => {

  return new Promise<string>((resolve, reject) => {

    cloudinary.v2.uploader
      .upload_stream(
        {
          folder: "grocery",
        },
        (error, result) => {

          if (error) {
            reject(error);

          } else {
            resolve(result?.secure_url || "");
          }
        }
      )
      .end(fileBuffer);
  });
};

export default uploadoncloudinary;