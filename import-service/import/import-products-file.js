const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

module.exports.importProductsFile  = async (event) => {
  console.log(event.queryStringParameters);
  const url = await createPresignedUrlWithClient({
    region: process.env.BUCKET_REGION,
    bucket: process.env.BUCKET_NAME,
    key: `${ process.env.UPLOADED_FOLDER }/${ event.queryStringParameters.name }`
  });

  return {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    statusCode: 200,
    body: JSON.stringify({
      url
    }),
  };
};
