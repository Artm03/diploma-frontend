import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import authHeader, { getFingerPrint } from "./Auth";

const API_URL = "http://localhost:8080/api/";

class NeuroImages {
    async upload(file: File) {
        let formData = new FormData();
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        headers['Content-Type'] = 'multipart/form-data'

        formData.append("pic", file);
        return axios
            .post(API_URL + "upload", formData,
                {
                    headers: headers,
                    withCredentials: true
                });
    }

    async uploadFiles(pics: FormData, gallery_id: string) {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        headers['Content-Type'] = 'multipart/form-data'

        return axios
            .post(API_URL + "v1/neuro/upload", pics,
                {
                    params: {
                        gallery_id,
                    },
                    headers: headers,
                    withCredentials: true
                });
    }

    async detectFiles(pics: FormData, gallery_id: string) {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        headers['Content-Type'] = 'multipart/form-data'

        return axios
            .post(API_URL + "v1/neuro/detect", pics,
                {
                    params: {
                        gallery_id,
                    },
                    headers: headers,
                    withCredentials: true
                });
    }


    async getFiles(gallery_id: string) {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        headers['Content-Type'] = 'multipart/form-data'
        const response = await axios
            .get(API_URL + "v1/images",
                {
                    params: {
                        gallery_id,
                    },
                    headers: headers,
                    withCredentials: true
                })
        return response.data
    }

    async getGalleries() {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        const response = await axios
            .get(API_URL + "v1/gallery",
                {
                    headers: headers,
                    withCredentials: true
                })
        return response.data
    }

    async createGallery(name: string, description: string) {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        const response = await axios
            .post(API_URL + "v1/gallery", {
                id: uuidv4(),
                name,
                description
            },
                {
                    headers: headers,
                    withCredentials: true
                })
        return response.data
    }

    async deleteGallery(gallery_id: string) {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        const response = await axios
            .delete(API_URL + "v1/gallery",
                {
                    params: {
                        gallery_id,
                    },
                    headers: headers,
                    withCredentials: true
                })
        return response.data
    }
}

export const neuro_images = new NeuroImages()
