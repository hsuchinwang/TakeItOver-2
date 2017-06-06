import axios from 'axios';
import * as Config from '../constants/Config';

export const SYS_ERROR_HANDLE = 'SYS_ERROR_HANDLE';

const defaultOption = {
  requests: [],
  ignoreError: false,
};

const defaultRequestOption = {
  host: '',
  path: '',
  port: window._defaultPort || 80,
  headers: {},
  url: '',
  method: 'get',
  params: null,
  data: null,
};

function run(option) {
  return new Promise((resolve, reject) => {
    option = normalizeRequest(option);
    let isRemoteSite = false;
    if (option instanceof Array) {
      option.forEach(val => {
        isRemoteSite = val.url && val.url.indexOf('mount/info') > -1;
      });
    } else {
      isRemoteSite = option.url && option.url.indexOf('mount/info') > -1;
    }

    genAxiosPromise(option).then((res) => {
      if (res instanceof Array) {
        resolve(res.map(value => value.data));
      } else {
        if (res.data.status === undefined || res.data.status == 0) {
          if (res.data.status === undefined)
            console.warn(`${option.path.length === 0 ? option.url : option.path}: response must to normalize`);
          resolve(res.data);
        } else if (res.status === 203 || res.data.status > 0) {
            reject(res);
        } else {
          // throw Error(`${option.path}: ${res.data.message}`);
          throw Error(res);
        }
      }
    }).catch((err) => {
      // FIXME, move to another file
      const deniedStatus = [401, 403];
      if (err instanceof Object && 'response' in err && err.response.status && ((deniedStatus.indexOf(err.response.status) > -1 && !isRemoteSite) || err.response.status === 405)) {
        window.location.href = '/ns/';
        return;
      }
      // console.error(err);
      reject(err);
    });
  });
}

export function callApi(option) {
  if (option.requests instanceof Array && option.ignoreError !== undefined) {
    option = { ...defaultOption, ...option };
    if (option.ignoreError) {
      return new Promise(resolve => {
        const apiResults = [];
        const handler = (index, result) => {
          if (result.status !== 200) {
            apiResults[index] = new Error(result.statusText);
          } else {
            apiResults[index] = result.data;
          }

          if (apiResults.length === option.requests.length) resolve(apiResults);
        };

        for (const key in option.requests) {
          genAxiosPromise(normalizeRequest(option.requests[key]))
            .then(handler.bind(this, key))
            .catch(handler.bind(this, key));
        }
      });
    }
    return run(option.requests);
  }
  return run(option);
}

export function callApiWithAction(option, successAction, errorAction = null) {
  return (dispatch, getState) => {
    callApi(option).then(res => {
      const result = successAction(res);
      if (result) dispatch(result);
    }).catch(res => {
      if (errorAction) {
        const result = errorAction(res);
        if (result) dispatch(result);
      }
    });
  };
}

function genAxiosPromise(option) {
  if (option instanceof Array)
    return axios.all(option.map(value => genAxiosPromise(value)));
  else
    return axios({ ...option });
}

export function requireOption(siteInfo, path, method = null, params = null) {
  let require = { path };
  if (method) require.method = method;
  if (params) require.params = params;
  if (!siteInfo) return require;

  const {
    connectionid,
    host,
    port,
    mount_userid,
    type,
  } = siteInfo;

  if (connectionid && connectionid !== 'local') {
    if (host) require.host = host;
    if (port) require.port = port;
    require.headers = {
      'X-Auth-Userid': mount_userid,
      'X-Auth-Token': connectionid,
    };
    require.type = type;
  }
  return require;
}

function normalizeRequest(option) {
  if (option instanceof Array) {
    return option.map(value => normalizeRequest(value));
  } else {
    if (typeof option === 'string') {
      option = { ...defaultRequestOption, path: option };
    } else {
      option = { ...defaultRequestOption, ...option };
    }
    option.headers['X-Requested-With'] = 'XMLHttpRequest';
    const isRemoteNas = (option.type && option.type !== 'Default');
    // const isRemoteNas = (option.headers && 'X-Auth-Token' in option.headers && !!option.host && Config.BASE_URL.indexOf(option.host) < 0);
    // setting url
    if (option.host && option.path) {
      if (isRemoteNas) {
        const formData = {
          url: `https://${option.host}:${option.port}/ns/api/v2/${option.path}`,
          method: option.method,
          connectionid: option.headers['X-Auth-Token'],
          mount_userid: option.headers['X-Auth-Userid'],
          params: option.params,
        };
        option.method = 'post';
        option.params = formData;
        option.url = `${Config.BASE_URL}:${defaultRequestOption.port}/ns/api/v2/mount/info`;
        delete option.headers;
      } else {
        option.url = `${window.location.protocol}//${option.host}:${option.port}/ns/api/v2/${option.path}`;
      }
    } else if (!option.host && option.path) {
      option.url = `${Config.BASE_URL}:${option.port}/ns/api/v2/${option.path}`;
    }

    // setting params
    if (option.params && (option.method === 'put' || option.method === 'post')) {
      option.data = option.params;
      option.params = null;
    }

    return option;
  }
}

export function requestTransformer(data) {
  let body = '';
  for (const key in data) {
    if (!data[key]) continue;
    if (data[key].constructor === Array) {
      data[key].forEach(value => {
        if (body.length !== 0) body += '&';
        body += `${key}[]=${value}`;
      });
    } else {
      body += `&${key}=${data[key]}`;
    }
  }
  return body;
}

export function errorHandle(err, errType) {
  return {
    type: SYS_ERROR_HANDLE,
    err,
    errType,
  };
}
