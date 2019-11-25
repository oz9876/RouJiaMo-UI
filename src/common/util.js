import { message } from 'antd';
import nprogress from 'nprogress';
import md5 from 'md5';

export let API = '';
export let WEB = '';
export let AppKey = '';
export let wxHtmlName = '';
export let liveBroadCastSdkAppId = 0;

// 每次请求返回的条数
export const pageSize = 10;
const ENV_API = process.env.ENV_API;


window.API = API;