import { GraphQLYogaError } from "@graphql-yoga/node";
import { unlink, createReadStream } from "node:fs";
import fs from "node:fs/promises";
import nodePath from "node:path";
import * as mkdirp from "mkdirp";
import mime from "mime-types";
import cuid from "cuid";
import { s3Client } from "../../s3Client";
import { CreateBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import formidable from "formidable";
import Context from "src/context";
import { MutationResolvers } from "src/generated/graphql";

const uploadDir = "./uploads";

const writeFileStreaming = async (file: File) => {
  try {
    // Ensure upload directory exists
    mkdirp.sync(uploadDir);
    const fileStream = file.stream();
    const id = cuid();
    const filename = file.name;
    const path = `${uploadDir}/${id}-${filename}`;
    await fs.writeFile(nodePath.join(process.cwd(), path), fileStream);
    const mimetype: any = mime.lookup(path) ?? "";
    return {
      id,
      filename,
      mimetype,
      path: path.substr(2),
    };
  } catch (error: any) {
    throw new GraphQLYogaError(error);
  }
};

const createSpaceBucket = async () => {
  try {
    const bucketParams = { Bucket: process.env.DO_SPACES_BUCKET };
    const data = await s3Client.send(new CreateBucketCommand(bucketParams));
    console.log("Success", data);
    return data;
  } catch (error: any) {
    throw new GraphQLYogaError(error);
  }
};

const uploadToSpaces = async (file: File) => {
  const form = formidable();
  console.log("form: ", form);

  // form.parse(reqt: IncomingMessage, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
  //   console.log('files: ', files);
  //   console.log('fields: ', fields);
  //   console.log('err: ', err);

  // })

  // form.parse(req: IncomingMessage, async (err, fields, files) => {
  //   if (err) {
  //     // res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
  //     // res.end(String(err));
  //     return;
  //   }
  //   // res.writeHead(200, { 'Content-Type': 'application/json' });
  //   // res.end(JSON.stringify({ fields, files }, null, 2));
  // })

  console.log("file: ", JSON.stringify(file, undefined, 2));
  const id = cuid();
  const filename = file.name;
  const path = `${uploadDir}/${id}-${filename}`;

  const bucketParams = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: `${id}-${filename}`,
    Body: createReadStream(filename),
  };

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: bucketParams,
      tags: [
        /*...*/
      ], // optional tags
      queueSize: 4, // optional concurrency configuration
      // partSize: 1024 * 1024 * 1, // optional size of each part, in bytes, at least 1MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log("progress: ", progress);
    });

    await parallelUploads3.done();

    // const data = await s3Client.send(new PutObjectCommand(bucketParams));
    // console.log("data: ", data);
    // console.log(
    //   "Successfully uploaded object: " +
    //     bucketParams.Bucket +
    //     "/" +
    //     bucketParams.Key
    // );
    const mimetype: any = mime.lookup(path) ?? "";
    return {
      id,
      filename,
      mimetype,
      path: path.substr(2),
    };
  } catch (error: any) {
    throw new GraphQLYogaError(error);
  }
};

export function deleteAllFiles(files: any) {
  return new Promise((resolve, reject) => {
    var i = files.length;
    files.forEach(function (file: any) {
      let filepath = `${uploadDir}/${file.id}-${file.filename}`;
      unlink(filepath, function (err) {
        i--;
        if (err) {
          return reject(err);
        } else if (i <= 0) {
          return resolve(null);
        }
      });
    });
  });
}

export function deleteSingleFile(file: any) {
  return new Promise((resolve, reject) => {
    let filepath = `${uploadDir}/${file.id}-${file.filename}`;
    unlink(filepath, function (err) {
      if (err) return reject(err);
      else return resolve(null);
    });
  });
}

const FileUpload: MutationResolvers = {
  async uploadFile(
    parent,
    { file }: { file: File },
    { prisma }: Context,
    info
  ) {
    try {
      // const userId = getUserId(request, false)
      // try {
      //   const success = await uploadToSpaces(file);
      //   console.log("success: ", success);
      // } catch (error: any) {
      //   console.log("Spaces error: ", error);
      // }

      const { id, filename, mimetype, path } = await writeFileStreaming(file);
      return prisma.file.create({ data: { id, filename, mimetype, path } });
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },

  async uploadFiles(
    parent,
    args: { files: File[] },
    { prisma }: Context,
    info
  ) {
    try {
      // const userId = getUserId(request, false)

      const processUpload = async (file: File) => {
        const { id, filename, mimetype, path } = await writeFileStreaming(file);
        return prisma.file.create({ data: { id, filename, mimetype, path } });
      };

      return Promise.all(args.files.map(processUpload));
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },

  async deleteFile(parent, args, { prisma }: Context, info) {
    try {
      // const userId = getUserId(request, false)
      // Ensure upload directory exists
      mkdirp.sync(uploadDir);

      await deleteSingleFile(args.file);
      return prisma.file.delete({ where: { id: args.file.id } });
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },

  async deleteFiles(parent, args, { prisma }: Context, info) {
    try {
      // const userId = getUserId(request, false)
      // Ensure upload directory exists
      mkdirp.sync(uploadDir);

      await deleteAllFiles(args.files);
      let ids = args.files.map((file: any) => file.id);
      let filenames = args.files.map((file: any) => file.filename);

      return prisma.file.deleteMany({
        where: {
          AND: [
            {
              id: {
                in: ids,
              },
            },
            {
              filename: {
                in: filenames,
              },
            },
          ],
        },
      });
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },
};

export default FileUpload;
