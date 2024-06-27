const EventEmitter = require('events');

class SocketMock extends EventEmitter {
  constructor() {
    super();
    this.connected = true;
  }

  emit(event, data) {
    super.emit(event, data);
  }

  on(event, callback) {
    super.on(event, callback);
  }

  off(event, callback) {
    super.off(event, callback);
  }

  close() {
    this.connected = false;
  }

  disconnect() {
    this.close();
  }

  connect() {
    this.connected = true;
  }
}

module.exports = {
  io: jest.fn(() => new SocketMock())
};
