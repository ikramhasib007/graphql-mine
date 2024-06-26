import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../s3Client";
import { Upload } from "@aws-sdk/lib-storage";
import Context from "../../context";
import { DeleteFileInput, MutationResolvers } from "../../generated/graphql";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

const subDirectory = process.env.DO_SPACES_BUCKET_PATH || 'development/images';

const uploadToSpaces = async (file: File) => {
  const id = uuidv4();
  const filename = file.name;
  const path = `${subDirectory}/${id}-${filename}`;

  const bucketParams = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: path,
    ACL: ObjectCannedACL.public_read,
    Body: file,
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

    await parallelUploads3.done();

    return {
      id,
      filename,
      mimetype: file.type,
      encoding: "utf-8",
      path,
    };
  } catch (error: any) {
    throw new GraphQLError(error);
  }
};

const deleteFileFromSpaces = async (file: DeleteFileInput) => {
  const bucketParams = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: file.path,
  };
  await s3Client.deleteObject(bucketParams);
};

const FileUpload: MutationResolvers = {
  async uploadFile(
    parent,
    { file }: { file: File },
    { prisma }: Context,
    info
  ) {
    try {
      // const userId = getUserId(request, false)
      const data = await uploadToSpaces(file);
      return prisma.file.create({ data });
    } catch (error: any) {
      throw new GraphQLError(error);
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
        const data = await uploadToSpaces(file);
        return prisma.file.create({ data });
      };
      return Promise.all(args.files.map(processUpload));
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },

  async deleteFile(parent, args, { prisma }: Context, info) {
    try {
      // const userId = getUserId(request, false)
      await deleteFileFromSpaces(args.file);
      return prisma.file.delete({ where: { id: args.file.id } });
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },

  async deleteFiles(parent, args, { prisma }: Context, info) {
    try {
      // const userId = getUserId(request, false)
      await Promise.all(args.files.map(deleteFileFromSpaces));
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
      throw new GraphQLError(error);
    }
  },
};

export default FileUpload;
