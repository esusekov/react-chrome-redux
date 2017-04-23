import browser from 'webextension-polyfill';

export function connect(id, options) {
  return browser.runtime.connect(id, options);
}

export function sendMessage(extensionId, message, options) {
  return browser.runtime.sendMessage(extensionId, message, options);
}

export function setMessageListener(listener) {
  browser.runtime.onMessage.addListener(listener);
}

export function setExternalMessageListener(listener) {
  if (browser.runtime.onMessageExternal) {
    browser.runtime.onMessageExternal.addListener(listener);
  } else {
    console.warn('runtime.onMessageExternal is not supported');
  }
}

export function setConnectListener(listener) {
  browser.runtime.onConnect.addListener(listener);
}

export function setExternalConnectListener(listener) {
  if (browser.runtime.onConnectExternal) {
    browser.runtime.onConnectExternal.addListener(listener);
  } else {
    console.warn('runtime.onConnectExternal is not supported');
  }
}