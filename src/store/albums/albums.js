/* eslint-disable */
import { API, graphqlOperation, Storage } from "aws-amplify";
import { listAlbums, getAlbum as getAlbumQuery } from "../../graphql/queries";
import { createAlbum as createAlbumMutation } from "../../graphql/mutations";
import { createPhoto as createPhotoMutation } from "@/graphql/mutations";
import { uuid } from "uuidv4";
import awsconfig from "@/aws-exports";

export const albumInfo = {
  namespaced: true,
  state: { albums: null, error: null },
  getters: {
    albums: (state) => state.albums,
  },
  mutations: {
    setAlbums(state, payload) {
      state.albums = payload;
    },
  },
  actions: {
    async createAlbum({ dispatch }, newAlbum) {
      try {
        await API.graphql(
          graphqlOperation(createAlbumMutation, { input: newAlbum })
        );
        console.log("albumcreated");
        dispatch("getAlbumsData");
      } catch (error) {
        console.log(error);
      }
    },
    async getAlbum(_, albumId) {
      return await API.graphql(
        graphqlOperation(getAlbumQuery, { id: albumId })
      );
    },
    async getAlbumsData({ commit }) {
      const albumsData = await API.graphql(graphqlOperation(listAlbums));
      commit("setAlbums", albumsData.data.listAlbums.items);
    },
    async createPhoto(_, data) {
      const {
        aws_user_files_s3_bucket_region: region,
        aws_user_files_s3_bucket: bucket,
      } = awsconfig;

      const { file, type: mimeType, id } = data;
      const extension = file.name.substr(file.name.lastIndexOf(".") + 1);
      const photoId = uuid();
      const key = `images/${photoId}.${extension}`;
      const inputData = {
        id: photoId,
        photoAlbumId: id,
        contentType: mimeType,
        fullsize: {
          key,
          region,
          bucket,
        },
      };

      //s3 bucket storage add file to it
      try {
        await Storage.put(key, file, {
          level: "protected",
          contentType: mimeType,
          metadata: { albumId: id, photoId },
        });
        await API.graphql(
          graphqlOperation(createPhotoMutation, { input: inputData })
        );
        return Promise.resolve("success");
      } catch (error) {
        console.log("createPhoto error", error);
        return Promise.reject(error);
      }
    },
  },
};
