import http from "lz-request/lib/http";
// 设置默认的基地址
http.setDefaultBaseURL("http://ivf.realsun.me:9001");

// 设置默认的请求头
http.setDefaultHeaders({
  "Content-Type": "application/json"
});

// 创建定制的获取提醒数量的 api，方法名为 'getReminderNum'
http.createApi("getReminderNum", {
  method: "get", // 使用 get 方法
  url: "/api/Resource/RetrieveReminderNum" // 请求地址
});

//默认options
http.setDefaultOptions({
  withCredentials: true
});

// http.setRequestInterceptors(
//   function(config) {
//     // 请求头加上 token
//     let token;
//     if ((token = localStorage.getItem("token"))) {
//       config.headers.token = token;
//     }
//     return config;
//   },
//   function(error) {
//     return error;
//   }
// );

// 响应拦截
// http.setResponseInterceptors(
//   response => {
//     const res = response.data;
//     if (
//       (res &&
//         (res.error === 0 ||
//           res.error === "0" ||
//           res.Error === 0 ||
//           res.Error === "0" ||
//           res.OpResult === "Y")) ||
//       res === "ok"
//     ) {
//       return response;
//     } else {
//       throw new Error(res.ErrMsg || res.message || res.ErrorMsg);
//     }
//   },
//   error => {
//     if (error.response.status === 401) {
//       // window.location.href = "/login";
//     }
//     return error;
//   }
// );

/**
 * 通过手机号、openid、unionid 来获取验证码
 * 参数：{ telephone, unionid, openid }
 * 1. telephone：手机号
 * 2. unionid：unionid
 * 3. openid：openid
 */
http.createApi("getVerCode", {
  method: "get",
  // baseURL: 'https://finisar.realsun.me/',
  url: "api/SMS/SMS_SendValidCode"
});

/**
 * 注册
 * 参数：{ telephone, unionid, openid, validCode, personid, method }
 * 1. telephone：手机号
 * 2. unionid：unionid
 * 3. openid: openid
 * 4. personid：身份证
 * 5. method：method
 * openid,telephone,unionid,validCode,workNum
 */
http.createApi("register", {
  method: "get",
  // baseURL: 'https://finisar.realsun.me/',
  url: "api/Account/Register"
});

/**
 *登录
 */
http.createApi("login", {
  method: "post",
  url: "/api/Account/Login"
});

/**
 *获取表格数据 |新接口
 */
http.createApi("getTableNew", {
  method: "get",
  url: "/api/200/table/Retrieve"
});

/**
 *上传图片
 */
http.createApi("putOneImageObject", {
  method: "post",
  url: "/api/AliyunOss/PutOneImageObject"
});

export default http;
