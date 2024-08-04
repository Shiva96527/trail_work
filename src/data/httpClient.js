import axios from "axios";
import { toast } from "react-toastify";
let count = 0;
export const httpClient = (baseUrl) => {
    return axios.create({
        baseURL: baseUrl,
        timeout: 50000
    });
}

export const activateInterceptors = (instance) => {
    instance.interceptors.request.use((request, error) => {
        //Do something before request is sent
        count++
        if (!request.url.startsWith('/upload/status')) {
            document.getElementById("loading").style.display = "block";
        }
        if (error) {
            console.log(error);
            document.getElementById("loading").style.display = "none";
            count--;
            return Promise.reject(request);
        }
        return request;
    });

    instance.interceptors.response.use(
        (response) => {
            //Any status code that falls within 2xx
            if (response && response.data) {
                count--;
                if (count === 0) {
                    document.getElementById("loading").style.display = "none";
                }
                return response;
            }
        },
        (error) => {
            //Any status code that falls outside 2xx
            if (error.response) {
                toast.error(error?.response?.statusText);
            } else if (error.request) {
                //Request has been made but no response is received
                // toast.error(error?.request?.statusText);
            } else {
                // Something happened in setting up the request that triggered an Error
                // toast.error(error.message);
            }
            count--;
            if (count === 0) {
                document.getElementById("loading").style.display = "none";
            }
            return error.response;
        }
    );
}

