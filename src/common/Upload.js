const FAILED = 0;
const SUCCESS = 1;
const ABORT = 2;

export function uploadFile(url, data, callback) {
  const formData = new FormData();
  if (!!data.file) {
    formData.append('uploadFile', data.file);
  } else if (!!data.nas) {
    if (data.nas.local) {
      formData.append('nasPath', data.nas.nasPath);
    } else if (!data.nas.local) {
      formData.append('remoteList', JSON.stringify({
        remoteNasPath: data.nas.remoteNasPath,
        username: data.nas.username,
        connectionid: data.nas.connectionid,
      }));
    }
  } else if (!!data.src) {
    formData.append('url', data.src);
  }

  const request = new XMLHttpRequest();
  request.upload.addEventListener('progress', progress.bind(this, callback));
  request.addEventListener('load', success.bind(this, request, callback), false);
  request.addEventListener('error', error.bind(this, request, callback), false);
  request.addEventListener('abort', abort.bind(this, request, callback), false);
  request.open('POST', url, true);
  request.send(formData);
  return request;
}

function responseCreator(status, progress = -1, message = null) {
  let payload = {};
  if (message !== null) payload.message = message;
  if (progress !== -1) payload.progress = progress;
  return { status, payload };
}

function progress(callback, e) {
  let percentComplete = 0;
  if (e.lengthComputable) percentComplete = e.loaded / e.total * 80;
  callback(responseCreator(SUCCESS, percentComplete));
}

function success(request, callback, e) {
  try {
    let data = null;
    if (e.target.status === 200) {
      data = JSON.parse(request.responseText);
      if (data) callback(responseCreator(SUCCESS, 100, data));
    } else if (e.target.status === 403) {
      data = JSON.parse(request.responseText);
      callback(responseCreator(FAILED, 0, data));
    } else {
      callback(responseCreator(FAILED));
    }
  } catch (e) {
    // FIXME error handle
  }
}

function error(request, callback, e) {
  console.log('error', e);
  callback(responseCreator(FAILED));
}

function abort(request, callback, e) {
  callback(responseCreator(ABORT));
}
