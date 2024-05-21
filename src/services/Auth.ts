import axios from "axios";
import UAParser from "ua-parser-js";
import Fingerprint2 from "fingerprintjs2";

const API_URL = "http://localhost:8080/api/v1/user/";

export default function authHeader() {
    const userStr = localStorage.getItem("user");
    let user = null;
    if (userStr)
        user = JSON.parse(userStr);

    if (user && user.access_token) {
        return { Authorization: `${user.access_token}`,  'Access-Control-Allow-Origin': "http://localhost:3000",};
    } else {
        return { Authorization: '', 'Access-Control-Allow-Origin': "http://localhost:3000", };
    }
}

export const getFingerPrint = async () => {
    const options = {
        excludes: {
            plugins: true,
            localStorage: true,
            adBlock: true,
            screenResolution: true,
            availableScreenResolution: true,
            enumerateDevices: true,
            pixelRatio: true,
            doNotTrack: true,
        },
        preprocessor: (key: any, value: any) => {
            if (key === 'userAgent') {
                const parser = new UAParser(value);
                return `${parser.getOS().name} :: ${parser.getBrowser().name} :: ${parser.getEngine().name
                    }`;
            }
            return value;
        },
    };

    try {
        const components = await Fingerprint2.getPromise(options);
        const values = components.map(component => component.value);
        console.log('fingerprint hash components', components);

        return String(Fingerprint2.x64hash128(values.join(''), 31));
    } catch (e) {
        console.error(e);
    }
};

class RegistryService {
    async registry(email: string, first_name: string, last_name: string, password: string, email_code: string) {
        return axios
            .post(API_URL + "registry", {
                email,
                first_name,
                last_name,
                password,
                email_code
            },
                {
                    headers: {
                        'Access-Control-Allow-Origin': "http://localhost:3000",
                    },
                    withCredentials: true,
                }
            );
    }

    async login(email: string, password: string, email_code: string) {
        const response = await axios
            .request({
                method: "post",
                url: API_URL + "login",
                headers: {
                    'X-Fingerprint-ID': (await getFingerPrint()) ?? '',
                    'Access-Control-Allow-Origin': "http://localhost:3000",
                },
                data: {
                    username: email,
                    password,
                    email_code
                },
                withCredentials: true,
            });
        if (response.data && response.data.access_token) {
            localStorage.setItem("user", `${JSON.stringify(response.data.access_token)}`);
        }
    }

    async refresh() {
        const response = await axios
            .request({
                method: "get",
                url: API_URL + "refresh",
                headers: {
                    'X-Fingerprint-ID': (await getFingerPrint()) ?? '',
                    'Access-Control-Allow-Origin': "http://localhost:3000",
                },
                withCredentials: true,
            });
        if (response.data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response
    }

    async get_user() {
        const headers: Record<string, string> = authHeader()
        headers['X-Fingerprint-ID'] = (await getFingerPrint()) ?? ''
        const response = await axios
            .request({
                method: "get",
                url: API_URL + "me",
                headers: headers,
                withCredentials: true,
            });
        return response.data
    }
}

export const registry_service = new RegistryService()
