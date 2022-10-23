import { GraphQLYogaError } from "@graphql-yoga/node";
import { unlink } from "node:fs";
import fs from "node:fs/promises";
import nodePath from "node:path";
import * as mkdirp from "mkdirp";
import mime from "mime-types";
import { GraphQLContext } from "../../context";
import { GraphQLResolveInfo } from "graphql";
import cuid from "cuid";

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

export default {
  async uploadFile(
    parent: any,
    { file }: { file: File },
    { prisma }: GraphQLContext,
    info: GraphQLResolveInfo
  ) {
    try {
      // const userId = getUserId(request, false)
      const { id, filename, mimetype, path } = await writeFileStreaming(file);
      return prisma.file.create({ data: { id, filename, mimetype, path } });
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },

  async uploadFiles(
    parent: any,
    args: any,
    { prisma }: GraphQLContext,
    info: GraphQLResolveInfo
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

  async deleteFile(
    parent: any,
    args: any,
    { prisma }: GraphQLContext,
    info: GraphQLResolveInfo
  ) {
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

  async deleteFiles(
    parent: any,
    args: any,
    { prisma }: GraphQLContext,
    info: GraphQLResolveInfo
  ) {
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
