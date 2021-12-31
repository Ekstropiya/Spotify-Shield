import { Axios } from 'axios';

export const axios = (authorization: string) => {
    return new Axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization}`,
        }
    });
};