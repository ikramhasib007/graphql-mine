import { GraphQLError } from "graphql";
import { unlink } from "node:fs";
import fs from "node:fs/promises";
import nodePath from "node:path";
import * as mkdirp from "mkdirp";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import Context from "../../context";
import { MutationResolvers } from "../../generated/graphql";

const uploadDir = "./uploads";

const writeFileStreaming = async (file: File) => {
  try {
    // Ensure upload directory exists
    mkdirp.sync(uploadDir);
    const fileStream = file.stream();
    const id = uuidv4();
    const filename = file.name;
    const path = `${uploadDir}/${id}-${filename}`;
    await fs.writeFile(nodePath.join(process.cwd(), path), fileStream);
    const mimetype: any = mime.lookup(path) ?? "";
    const encoding: any = mime.charset(path) ?? "";
    return {
      id,
      filename,
      mimetype,
      encoding,
      path: path.substr(2),
    };
  } catch (error: any) {
    throw new GraphQLError(error);
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
      const { id, filename, mimetype, encoding, path } =
        await writeFileStreaming(file);
      return prisma.file.create({
        data: { id, filename, mimetype, encoding, path },
      });
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
        const { id, filename, mimetype, encoding, path } =
          await writeFileStreaming(file);
        return prisma.file.create({
          data: { id, filename, mimetype, encoding, path },
        });
      };
      return Promise.all(args.files.map(processUpload));
    } catch (error: any) {
      throw new GraphQLError(error);
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
      throw new GraphQLError(error);
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
      throw new GraphQLError(error);
    }
  },
};

export default FileUpload;
