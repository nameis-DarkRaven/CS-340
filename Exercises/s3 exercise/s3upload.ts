import fs from "fs";
import path from "path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

s3upload();

async function s3upload() {
  if (process.argv.length !== 3) {
    console.log("Specify the file to upload on the command line");
    process.exit();
  }

  try {
    const client = new S3Client();
    const fileContent = fs.readFileSync(process.argv[2]);
    const fileName = path.basename(process.argv[2]);

    const params = {
      Body: fileContent,
      Bucket: "340-cs-s3-exercise", //TODO: Specify your bucket name,
      Key: `uploads/${fileName}`, //TODO: Specify name or file path you want to appear in S3,
    };

    const command = new PutObjectCommand(params); // TODO: Create the PutObjectCommand
    const response = await client.send(command); // TODO: Send the command and await the result
    console.log(
      "File upload successful with ",
      response.$metadata.httpStatusCode,
    );
  } catch (error) {
    console.log(error);
  }
}
