const AWS = require('aws-sdk');
const axios = require('axios');
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');

// Configura tus credenciales y región de AWS
AWS.config.update({
  accessKeyId: process.env.access_key,
  secretAccessKey: process.env.secret_access_key,
  region: process.env.region
});

const s3 = new AWS.S3();

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Indica el fin del stream
    return stream;
  }
  
  exports.downloadAndUploadImage = async function (url) {
    try {
      // Descarga la imagen
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'utf-8');
      const key = `images/${uuidv4()}.jpg`;

      // Convierte el buffer a stream
      const stream = bufferToStream(buffer);
  
      // Parámetros para subir a S3
      const uploadParams = {
        Bucket: "my-recipe-images-mastermenu",
        Key: key, // Nombre del archivo en S3
        Body: stream,
        ContentType: 'image/jpeg', // Ajusta según el tipo de imagen
      };
  
      // Sube la imagen a S3
      const result = await s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

