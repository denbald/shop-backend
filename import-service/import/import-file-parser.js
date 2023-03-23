const AWS = require('aws-sdk');
const csv = require('csv-parser');

const s3 = new AWS.S3({ region: process.env.BUCKET_REGION});

module.exports.importFileParser = async (event) => {
  // Get the object from S3
  console.log('file imported to uploaded folder');
  console.log(JSON.stringify(event));
  const bucketName = event.Records[0].s3.bucket.name;
  const sourceKey = event.Records[0].s3.object.key;
  const sourceFileName = event.Records[0].s3.object.key.split('/').pop();
  const sourceParams = {
    Bucket: bucketName,
    Key: sourceKey
  };

  try {
    const stream = s3.getObject(sourceParams).createReadStream().pipe(csv());

    for await (const record of stream) {
      console.log(record);
    }

    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${ bucketName }/${ sourceKey }`,
      Key: `${ process.env.PARSED_FOLDER }/${ sourceFileName }`,
    })
      .promise();

    await s3.deleteObject(sourceParams).promise();

  } catch (e) {
    console.log(e);
  }

};
