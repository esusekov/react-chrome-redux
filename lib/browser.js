'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.sendMessage = sendMessage;
exports.setMessageListener = setMessageListener;
exports.setExternalMessageListener = setExternalMessageListener;
exports.setConnectListener = setConnectListener;
exports.setExternalConnectListener = setExternalConnectListener;

var _webextensionPolyfill = require('webextension-polyfill');

var _webextensionPolyfill2 = _interopRequireDefault(_webextensionPolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connect(id, options) {
  return _webextensionPolyfill2.default.runtime.connect(id, options);
}

function sendMessage(extensionId, message, options) {
  return _webextensionPolyfill2.default.runtime.sendMessage(extensionId, message, options);
}

function setMessageListener(listener) {
  _webextensionPolyfill2.default.runtime.onMessage.addListener(listener);
}

function setExternalMessageListener(listener) {
  if (_webextensionPolyfill2.default.runtime.onMessageExternal) {
    _webextensionPolyfill2.default.runtime.onMessageExternal.addListener(listener);
  } else {
    console.warn('runtime.onMessageExternal is not supported');
  }
}

function setConnectListener(listener) {
  _webextensionPolyfill2.default.runtime.onConnect.addListener(listener);
}

function setExternalConnectListener(listener) {
  if (_webextensionPolyfill2.default.runtime.onConnectExternal) {
    _webextensionPolyfill2.default.runtime.onConnectExternal.addListener(listener);
  } else {
    console.warn('runtime.onConnectExternal is not supported');
  }
}