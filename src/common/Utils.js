import { NSSchema } from '../components/note/editor/nsEditor/Schema';

const ie_upto10 = /MSIE \d/.test(navigator.userAgent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
export const browser = {
  mac: /Mac/.test(navigator.platform),
  ie_upto10,
  ie_11up,
  ie: ie_upto10 || ie_11up,
  gecko: /gecko\/\d/i.test(navigator.userAgent),
};

export function connIdNormaliz(connId) {
  return connId === 'local' ? -1 : connId;
}

export function isInNoteList(noteList, noteId) {
  for (let i = 0; i < noteList.length; i++) {
    if (noteList[i].note_id === noteId) return true;
  }
  return false;
}


export function getBaseUrl(connId, siteList) {
  const connectionId = (connId === -1 || !connId) ? 'local' : connId;
  const {
    type,
    host,
    port,
    user_site: userType,
  } = siteList[connectionId];
  let result;
  if (type === 'Default') {
    result = `//${host}`;
    if (userType === 'NAS') result += `:${window.location.port}`;
  } else if (type === 'NAS') {
    result = `https://${host}`;
    if (+port !== 443) result += `:${port}`;
  } else {
    const proto = connectionId === 'local' ? '' : 'https:';
    result = `${proto}//${host}:${port}`;
  }
  return result;
}

export function setListOrder(list, key) {
  const order = list.map((obj) => {
    if (key === 'connectionid' && !obj[key]) return 'local';
    return obj[key];
  });
  return order;
}

export function convertTreeList(data, level = 0, connId = null) {
  const list = {};
  for (const index in data) {
    const value = data[index];
    switch (level) {
      case 0:
        connId = (!value.connectionid && value.type === 'Default') ? 'local' : value.connectionid;
        const nbList = 'nb_list' in value ? value.nb_list : [];
        const _data = {
          type: 'site',
          isDefault: value.is_default,
          subType: value.type,
          userSite: value.user_site,
          id: connId,
          name: value.connection_name,
          actType: null,
          connId,
        };

        if (nbList.length > 0) _data.num = value.nb_list.length;

        _data.list = convertTreeList(nbList, 1, connId);
        _data.order = setListOrder(nbList, 'nb_id');
        _data.order.push(`${connId}-trashcan`);

        list[connId] = _data;
        break;
      case 1:
        list[value.nb_id] = {
          type: 'notebook',
          isDefault: value.is_default,
          id: value.nb_id,
          name: value.nb_name,
          num: value.section_number,
          actType: null,
          shareInfo: value.share_info ? value.share_info : 0,
          sync: value.sync,
          connId,
        };
        list[value.nb_id].list = ('section_list' in value && value.section_list.length > 0) ?
          convertTreeList(value.section_list, 2, connId) : {};
        list[value.nb_id].order = ('section_list' in value && value.section_list.length > 0) ?
          setListOrder(value.section_list, 'sec_id') : [];
        break;
      case 2:
        list[value.sec_id] = {
          type: 'section',
          isDefault: value.is_default,
          id: value.sec_id,
          nbId: value.nb_id,
          name: value.sec_name,
          num: value.note_number,
          actType: null,
          shareInfo: value.share_info ? value.share_info : 0,
          connId,
        };
    }
  }
  if (level === 1) {
    /** Start of add trashcan **/
    list[`${connId}-trashcan`] = {
      type: 'trashcan',
      id: `${connId}-trashcan`,
      name: lang_dictionary.general_trashcan,
      actType: null,
      connId,
    };
    /** End of add trashcan **/
  }
  return list;
}

export function removeItemFromTreeList(tree, data) {
  const { list, order } = tree;
  let index = -1;
  const {
    connId,
    nbId,
    secId,
  } = data;

  // site
  if (!nbId && !secId && connId in list) {
    delete list[connId];
    index = order.indexOf(connId);
    if (index > -1) order.splice(index, 1);
  }
  // notebook
  else if (
    !secId &&
    connId in list &&
    list[connId].list && nbId in list[connId].list
  ) {
    delete list[connId].list[nbId];
    index = list[connId].order.indexOf(nbId);
    if (index > -1) list[connId].order.splice(index, 1);
  }
  // section
  else if (
    connId in list &&
    list[connId].list && nbId in list[connId].list &&
    list[connId].list[nbId].list && secId in list[connId].list[nbId].list
  ) {
    delete list[connId].list[nbId].list[secId];
    index = list[connId].list[nbId].order.indexOf(secId);
    if (index > -1) list[connId].list[nbId].order.splice(index, 1);
  }
  return { list, order };
}

export function convertPublicTreeList(data, state) {
  let shareType = '';
  const value = data;
  if ('sec_list' in value) shareType = 'share_notebook';
  else if ('note_list' in value) shareType = 'share_section';
  else shareType = 'share_note';

  switch (shareType) {
    case 'share_note':
      state.publicBookList = [{
        type: 'notebook',
        num: 1,
        id: value.nb_id,
        name: value.nb_name,
        list: [value.sec_id],
      }];
      state.publicSecList[value.sec_id] = {
        type: 'section',
        num: 1,
        id: value.sec_id,
        name: value.sec_name,
        list: [value.note_id],
      };
      state.publicNoteList[value.note_id] = {
        type: 'note',
        id: value.note_id,
        name: value.note_name,
        sec_name: value.sec_name,
        nb_name: value.nb_name,
      };
      break;
    case 'share_section':
      state.publicBookList = [{
        type: 'notebook',
        num: 1,
        id: value.nb_id,
        name: value.nb_name,
        list: [value.sec_id],
      }];
      state.publicSecList[value.sec_id] = {
        type: 'section',
        num: value.note_list.length,
        id: value.sec_id,
        name: value.sec_name,
        list: value.note_list.map((item) => {
          return item.note_id;
        }),
      };
      value.note_list.map((item) => {
        return state.publicNoteList[item.note_id] = {
          type: 'note',
          id: item.note_id,
          name: item.note_name,
          sec_name: value.sec_name,
          nb_name: value.nb_name,
        };
      });
      break;
    case 'share_notebook':
      state.publicBookList = [{
        type: 'notebook',
        num: value.sec_list.length,
        id: value.nb_id,
        name: value.nb_name,
        list: value.sec_list.map((item) => {
          return item.sec_id;
        }),
      }];
      value.sec_list.map((item) => {
        return state.publicSecList[item.sec_id] = {
          type: 'section',
          num: item.note_list.length,
          id: item.sec_id,
          name: item.sec_name,
          list: item.note_list.map((item) => {
            return item.note_id;
          }),
        };
      });
      value.sec_list.map((secItem) => {
        return secItem.note_list.map((item) => {
          return state.publicNoteList[item.note_id] = {
            type: 'note',
            id: item.note_id,
            name: item.note_name,
            sec_name: secItem.sec_name,
            nb_name: value.nb_name,
          };
        });
      });
      break;
    default:
  }
}

export function handleNotesData(data, state) {
  const {
    notesInfo: { info, notes },
    other: { rename, connId },
    noteInfo,
  } = data;
  const result = {
    ...state,
    secInfo: info,
    noteList: converNoteList(notes, connId),
    noteRename: rename || state.noteRename,
  };
  if (noteInfo) result.noteInfo = noteInfo;
  return result;
}

export function converNoteList(data, connId) {
  const notes = {
    list: {},
    order: [],
  };
  notes.order = data.map((value) => {
    notes.list[value.note_id] = value;
    notes.list[value.note_id].connId = connId;
    return value.note_id;
  });
  return notes;
}

export function transformNoteInfo(data, connId) {
  const result = {
    connId,
    nbId: data.nb_id,
    secId: data.sec_id,
    realNoteId: data.note_id,
    nbName: data.nb_name,
    secName: data.sec_name,
    id: data.note_id,
    name: data.note_name,
    userColors: {},
    tagList: data.tag_list,
    creator: data.creator,
    creatorId: data.creator_id,
    creatorName: data.creator_name,
    encrypt: data.encrypt,
    important: data.important,
    createTime: data.create_time,
    updateTime: data.update_time,
    lastEditor: data.last_editor,
    publicType: data.public_type,
    content: data.content,
    objContent: null,
    collaborator: data.collaborator,
    shareInfo: data.share_info,
    tools: data.permission_tool_bar,
    enabled: data.enabled,
    isDefault: data.is_default,
    version: +data.version,
    isCloud: data.user_site === 'Cloud',
    isSync: false,
  };

  if (data.user_color) result.userColors = JSON.parse(data.user_color);
  if (data.userInfo) {
    result.userId = data.userInfo.userId;
    result.userName = data.userInfo.name;
  }

  return result;
}


export function converNoteContent(data, baseUrl = null) {
  try {
    if (data.content) {
      if (baseUrl) {
        NSSchema.nodes.image.baseUrl = baseUrl;
        NSSchema.nodes.file.baseUrl = baseUrl;
      }
      const noteContent = data.objContent || NSSchema.nodeFromJSON(JSON.parse(data.content));
      const result = noteContent.content.toDOM();
      const container = document.createElement('div');
      container.appendChild(result);
      return container.innerHTML;
    }
  } catch (e) {
    console.error(e);
  }
  return '';
}

export function convertSiteNoteList(siteInfo, data) {
  const { connectionid } = siteInfo;
  const siteNotes = {};
  if (data.length === 0) return siteNotes;

  siteNotes[connectionid] = siteInfo;
  siteNotes[connectionid].list = {};

  data.map((value) => {
    siteNotes[connectionid].list[value.note_id] = value;
    siteNotes[connectionid].list[value.note_id].connId = connectionid;
  });
  return siteNotes;
}

export function convertTagTree(siteInfo, data) {
  const { connectionid } = siteInfo;
  const siteNotes = {};
  if (data.length === 0) return siteNotes;

  siteNotes[connectionid] = {
    type: 'tagSite',
    subType: siteInfo.type,
    userSite: siteInfo.user_site,
    id: connectionid,
    name: siteInfo.connection_name,
    actType: null,
    connId: connectionid,
  };
  siteNotes[connectionid].list = {};
  siteNotes[connectionid].order = [];

  data.map((value) => {
    siteNotes[connectionid].list[value.tag_id] = {
      type: 'tag',
      id: value.tag_id,
      name: value.tag_name,
      actType: null,
      connId: connectionid,
    };
    siteNotes[connectionid].order.push(value.tag_id);
  });
  return siteNotes;
}

export function transferString(replacedString, replaceValues = {}) {
  Object.keys(replaceValues).forEach(key => {
    replacedString = replacedString.replace(`\$\{${key}\}`, replaceValues[key], 'g');
  });
  return replacedString;
}
export function transferContactList(data) {
  return data.map(val => {
    return val.account;
  });
}
