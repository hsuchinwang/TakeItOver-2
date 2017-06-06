import { callApi, requireOption } from './apiActions';

export function getSectionByNotebook(nbId, siteInfo) {
  const require = requireOption(siteInfo, 'section', null, { nb_id: nbId });
  return callApi(require)
    .then(data => data.result)
    .catch(err => {
      console.log(err);
    });
}

export function deleteSection(secId, siteInfo) {
  const require = requireOption(siteInfo, `section/${secId}`, 'delete');
  return callApi(require)
    .then(data => data.result)
    .catch(err => {
      console.error(err);
    });
}
