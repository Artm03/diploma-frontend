import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/email/";

class EmailNotify {
    async registry(email: string) {
        const response = await axios
            .post(API_URL + "registry", {
                email,
            },
                {
                    headers: {
                        'Access-Control-Allow-Origin': "http://localhost:3000",
                    },
                    withCredentials: true
                });
        return response.data
    }

    async login(email: string, password: string) {
        return axios
            .post(API_URL + "login", {
                username: email,
                password,
            },
                {
                    headers: {
                        'Access-Control-Allow-Origin': "http://localhost:3000",
                    },
                    withCredentials: true
                });
    }

    async recovery(email: string) {
        return axios
            .post(API_URL + "recovery", {
                email,
            },
                {
                    headers: {
                        'Access-Control-Allow-Origin': "http://localhost:3000",
                    },
                    withCredentials: true
                });
    }
}

export const email_notify = new EmailNotify()
