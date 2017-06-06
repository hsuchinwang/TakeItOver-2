import io from 'socket.io-client';

export default class ChatClient {

  constructor(url, userId, token, path) {
    this.url = url;
    this.userId = userId;
    this.token = token;
    this.firstConnect = true;
    this.path = path;

    this.listenType = ['tag' ,'notification', 'note', 'sync_notifi', 'open', 'close', 'error'];
    this.listeners = this.initListenerQueue();
    this.isConnected = false;
    this.socket = this.connect();
  }

  destructor() {
    this.url = this.prot = this.firstConnect = this.listeners = this.path = null;
  }

  connect() {
    const protocol = this.url.split['://'];

    let wsUrl = this.url;
    if (this.userId && this.token) wsUrl += `?userId=${this.userId}&token=${this.token}`;

    const wsOptions = {
      reconnection: true,
      pingInterval: 10000,
      pingTimeout: 30000,
      secure: protocol === 'https' || location.protocol === 'https:',
      rejectUnauthorized: false,
    };
    if (this.path) wsOptions.path = this.path;

    const socket = io.connect(wsUrl, wsOptions);
    socket.on('connect', this.open.bind(this));
    socket.on('error', this.error.bind(this));
    socket.on('disconnect', this.close.bind(this));
    socket.on('connect_error', this.error.bind(this));
    return socket;
  }

  disconnect() {
    this.listeners = this.initListenerQueue();
    this.socket.disconnect();
    this.destructor();
  }

  sendNoteMessage(msg) {
    return this.send(msg, 'note');
  }

  sendUpatedNoteTags(connId, realNoteId) {
    const msg = { connId: connId, realNoteId: realNoteId};
    return this.send(msg, 'tag');
  }

  send(msg, type = 'message') {
    if (this.isConnected) this.socket.emit(type, msg);
    return this;
  }

  open() {

    this.isConnected = true;
    if (this.firstConnect) {
      this.bindInitCallback();
      this.firstConnect = false;
    } else {
      for (let i = 0; i < this.listeners.open.length; i++) {
        this.listeners.open[i]();
      }
    }
  }

  initListenerQueue() {
    const result = {};
    for (let i = 0; i < this.listenType.length; i++) {
      result[this.listenType[i]] = [];
    }
    return result;
  }

  bindInitCallback() {
    for (let i = 0; i <= 3; i++) {
      const type = this.listenType[i];
      this.socket.on(type, data => {
        try {
          const message = typeof data === 'string' ? JSON.parse(data) : data;
          const listeners = this.listeners[type];
          for (let j = 0; j < listeners.length; j++) {
            listeners[j](message);
          }
        } catch (err) {
          console.error(err, data, typeof data);
        }
      });
    }
    for (let i = 0; i < this.listeners[this.listenType[4]].length; i++) {
      this.listeners[this.listenType[4]][i]();
    }
  }

  error(e) {
    console.error('connection error', e);
    this.isConnected = false;
    this.listeners.error.forEach(func => { func(); });
  }

  close(doClose) {
    console.error('disconnection');
    this.isConnected = false;
    if (!!this.listeners) this.listeners.close.forEach(func => { func(null, null, doClose); });
  }

  addListener(type, callback) {
    if (this.listenType.indexOf(type) < 0) throw new Error('invalid type');
    this.listeners[type].push(callback);
    return this.listeners;
  }

  removeListener(type, callback) {
    if (!this.listeners) return;
    else if (this.listenType.indexOf(type) < 0) throw new Error('invalid type');

    for (let i = 0; i < this.listeners[type].length; i++) {
      if (this.listeners[type][i] === callback) {
        this.listeners[type].splice(i, 1);
      }
    }
  }

  clearListener() {
    this.listeners = null;
  }

}
