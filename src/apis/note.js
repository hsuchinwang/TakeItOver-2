import { callApi, requireOption, errorHandle } from './apiActions';
import { transformNoteInfo } from '../common/Utils';

export function getNoteInfo(noteId, siteInfo) {
  const require = requireOption(siteInfo, `note/${noteId}`);
  return callApi(require)
    .then(data => transformNoteInfo(data.note_info, siteInfo ? siteInfo.connectionid : 'local'))
    .catch(e => { throw errorHandle(e, 'NOTE_SET_INFO_ERRMSG'); });
}

export function getSnapshotNote(snapshotId, siteInfo) {
  const require = requireOption(siteInfo, `snapshot/${snapshotId}`);
  return callApi(require)
    .catch(e => { throw errorHandle(e, 'NOTE_GET_SNAPSHOT_ERRMSG'); });
}

export function decryptSnapshot(snapshotId, passwd, siteInfo) {
  const require = requireOption(siteInfo, `snapshot/${snapshotId}/check_encrypt`, 'post', { encrypt_code: passwd });
  return callApi(require)
    .catch(e => { throw errorHandle(e, 'NOTE_SNAPSHOT_DECRYPT_ERRMSG'); });
}

export function getNoteListBySection(secId, siteInfo) {
  const require = requireOption(siteInfo, 'note', null, { sec_id: secId });
  return callApi(require)
    .then(data => {
      return {
        notes: data.note_list,
        info: data.sec_info,
      };
    })
    .catch(e => { throw errorHandle(e, 'NOTEBOOK_SET_NOTE_LIST_ERRMSG'); });
}

export function getNoteListByTag(tagId, siteInfo) {
  const require = requireOption(siteInfo, `tag/${tagId}`);

  return callApi(require)
    .then(data => {
      return {
        notes: data.note_list,
        info: {
          type: 'tag',
          sec_name: data.tag_info.tag_name,
        },
      };
    })
    .catch(e => { throw errorHandle(e, 'NOTEBOOK_SET_NOTE_LIST_ERRMSG'); });
}

export function getTagListByNote(noteId, siteInfo) {
  const require = requireOption(siteInfo, `note/${noteId}/taglist`);

  return callApi(require)
    .then(data => { return data.tag_list; })
    .catch(e => { throw errorHandle(e, 'TAG_GET_LIST_ERRMSG'); });
}

// FIXME, do not direct using lang_dictionary
export function getNoteListInTrashcan(siteInfo) {
  const require = requireOption(siteInfo, 'recycle_bin', null);
  return callApi(require)
    .then(data => {
      return {
        notes: data.note_list,
        info: {
          sec_name: window.lang_dictionary.general_trashcan,
          type: 'trashcan',
        },
      };
    })
    .catch(e => { throw errorHandle(e, 'NOTEBOOK_SET_TRASH_LIST_ERRMSG'); });
}

export function saveTagListByNoteId(noteId, tagList, siteInfo) {
  const require = requireOption(siteInfo, `note/${noteId}/addtag`, 'post', { tag_list: tagList });
  return callApi(require)
    .then(data => { return data.tag_list; })
    .catch(e => { throw errorHandle(e, 'TAG_SAVE_LIST_ERRMSG'); });
}
