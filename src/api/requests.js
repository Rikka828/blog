import axios from "axios"
import { Store } from '../store'
const store = Store()
const requests = axios.create({
    baseURL: "http://127.0.0.1:3000",
    timeout: 5000
})
requests.interceptors.request.use(function (config) {
    if(store.token){
        config.headers.token = store.token
    }
    return config;
});

export default requests