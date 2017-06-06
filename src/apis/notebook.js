import { callApi, requireOption, errorHandle } from './apiActions';

export function getNotebookBySite(siteInfo) {
  const require = requireOption(siteInfo, 'notebook');
  return callApi(require)
    .then(data => data.notebook_list)
    .catch(err => {
      console.error(err);
    });
}

export function getSyncInfo(nbId, siteInfo) {
  const require = requireOption(siteInfo, `sync/status/${nbId}`);
  return callApi(require)
    .then(data => ({
      connectionName: data.connection_name,
      nbId: data.nb_id,
      nbName: data.nb_name,
      targetSite: data.target_site,
    }))
    .catch(err => { throw errorHandle(err, 'NOTEBOOK_GET_SYNC_INFO_ERRMSG'); });
}
