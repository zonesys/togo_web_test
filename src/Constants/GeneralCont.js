export const apiUrl = process.env.REACT_APP_BACKEND_URL;
export const imgBaseUrl = `https://${process.env.REACT_APP_DOMAIN}/togo/MobileAPi/`;
export const requestHeaders = {
    "Access-Control-Allow-Origin": `*`,
    "Content-Type": `application/x-www-form-urlencoded`,
};