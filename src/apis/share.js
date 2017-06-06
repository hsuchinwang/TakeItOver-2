import { callApi, requireOption } from './apiActions';
import { transferContactList } from '../common/Utils';

export function getShareWithMe(siteInfo) {
  const options = requireOption(siteInfo, 'my/share_with_me');
  return callApi(options).then(res => res.list);
}

export function getShareList(siteInfo) {
  const options = requireOption(siteInfo, 'my/share_list');
  return callApi(options).then(res => res.list);
}

export function getPublishedLinks(siteInfo) {
  const options = requireOption(siteInfo, 'my/public_link');
  return callApi(options).then(res => res.list);
}

export function getAllShareWithMe(siteInfoList) {
  return new Promise(resolve => {
    const result = {};
    const siteKeys = Object.keys(siteInfoList);
    let count = 0;
    siteKeys.forEach(key => {
      getShareWithMe(siteInfoList[key]).then(res => {
        result[key] = res;
        count++;
        if (count === siteKeys.length) resolve(result);
      }).catch(err => {
        result[key] = {};
        count++;
        if (count === siteKeys.length) resolve(result);
      });
    });
  });
}

export function getAllShareList(siteInfoList) {
  return new Promise(resolve => {
    const result = {};
    const siteKeys = Object.keys(siteInfoList);
    let count = 0;
    siteKeys.forEach(key => {
      getShareList(siteInfoList[key]).then(res => {
        result[key] = res;
        count++;
        if (count === siteKeys.length) resolve(result);
      }).catch(err => {
        result[key] = {};
        count++;
        if (count === siteKeys.length) resolve(result);
      });
    });
  });
}

export function getAllPublishedLinks(siteInfoList) {
  return new Promise(resolve => {
    const result = {};
    const siteKeys = Object.keys(siteInfoList);
    let count = 0;
    siteKeys.forEach(key => {
      getPublishedLinks(siteInfoList[key]).then(res => {
        result[key] = res;
        count++;
        if (count === siteKeys.length) resolve(result);
      }).catch(err => {
        result[key] = {};
        count++;
        if (count === siteKeys.length) resolve(result);
      });
    });
  });
}

export function getMyContactList(siteInfo) {
  const options = requireOption(siteInfo, 'my/contacts');
  return callApi(options).then(res => transferContactList(res.list));
}

export function getNasUsers(siteInfo) {
  const options = requireOption(siteInfo, 'sys/nas/users');
  return callApi(options).then(res => transferContactList(res.users));
}
