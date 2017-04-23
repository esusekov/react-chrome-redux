'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

var _browser = require('../browser');

var browser = _interopRequireWildcard(_browser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @return {undefined}
 */
var promiseResponder = function promiseResponder(dispatchResult) {
  Promise.resolve(dispatchResult).then(function (res) {
    return {
      error: null,
      value: res
    };
  }).catch(function (err) {
    console.error('error dispatching result:', err);
    return {
      error: err.message,
      value: null
    };
  });
};

exports.default = function (store, _ref) {
  var portName = _ref.portName,
      dispatchResponder = _ref.dispatchResponder;

  if (!portName) {
    throw new Error('portName is required in options');
  }

  // set dispatch responder as promise responder
  if (!dispatchResponder) {
    dispatchResponder = promiseResponder;
  }

  /**
   * Respond to dispatches from UI components
   */
  var dispatchResponse = function dispatchResponse(request, sender, sendResponse) {
    if (request.type === _constants.DISPATCH_TYPE && request.portName === portName) {
      var action = Object.assign({}, request.payload, {
        _sender: sender
      });

      var dispatchResult = null;

      try {
        dispatchResult = store.dispatch(action);
      } catch (e) {
        dispatchResult = Promise.reject(e.message);
        console.error(e);
      }

      return dispatchResponder(dispatchResult);
    }
  };

  /**
  * Setup for state updates
  */
  var connectState = function connectState(port) {
    if (port.name !== portName) {
      return;
    }

    /**
     * Send store's current state through port
     * @return undefined
     */
    var sendState = function sendState() {
      port.postMessage({
        type: _constants.STATE_TYPE,
        payload: store.getState()
      });
    };

    // Send new state down connected port on every redux store state change
    var unsubscribe = store.subscribe(sendState);

    // when the port disconnects, unsubscribe the sendState listener
    port.onDisconnect.addListener(unsubscribe);

    // send initial state
    sendState();
  };

  /**
   * Setup action handler
   */
  browser.setMessageListener(dispatchResponse);

  /**
   * Setup external action handler
   */
  browser.setExternalMessageListener(dispatchResponse);

  /**
   * Setup extended connection
   */
  browser.setConnectListener(connectState);

  /**
   * Setup extended external connection
   */
  browser.setExternalConnectListener(connectState);
};