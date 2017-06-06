import { callApi, errorHandle } from './apiActions';

export function getLangList() {
  return callApi('user/lang')
    .then(data => data.language)
    .catch(err => { throw errorHandle(err, 'USER_GET_LANGLIST_ERRMSG'); });
}

export function setMigrateNS() {
  return callApi('sys/migrate')
		.then(data => data)
		.catch(err => { throw errorHandle(err, 'SYS_SET_MIGRATE_ERRMSG'); });
}
