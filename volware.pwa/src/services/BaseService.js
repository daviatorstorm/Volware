import axios from 'axios';
import { toast } from 'react-toastify';

export class BaseSevice {
    client = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });

    constructor() {
        
    }

    request(url, method, options, data) {
        let request = null;
        
        switch (method) {
            case 'get':
                request = this.client.request({
                    url, method, ...options
                });
                break;
            case 'post':
            case 'put':
                request = this.client.request({
                    url, method, data, ...options
                });
                break;
            default:
                request = this.client.request({
                    url, method, ...options
                });
                break;
        }

        return request.catch(err => {
            console.log(err);

            switch (err.response.status) {
                case 400:
                    let message = `${err.message}: \n`;

                    for (const key in err.response.data.errors) {
                        if (Object.hasOwnProperty.call(err.response.data.errors, key)) {
                            message = message.concat(', ', err.response.data.errors[key]);
                        }
                    }

                    console.log(message);

                    toast.error(message, {
                        position: "top-center",
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                    break;
                default:
                    toast.error(err.response.data, {
                        position: "top-center",
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                    break;
            }
        });
    }
}
