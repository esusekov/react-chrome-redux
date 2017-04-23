import {
  DISPATCH_TYPE,
  STATE_TYPE
} from '../constants';
import * as browser from '../browser'

/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @return {Promise}
 */
const promiseResponder = (dispatchResult) => {
  return Promise
    .resolve(dispatchResult)
    .then((res) => {
      return {
        error: null,
        value: res
      };
    })
    .catch((err) => {
      console.error('error dispatching result:', err);
      return {
        error: err.message,
        value: null
      };
    });
};

export default (store, {
  portName,
  dispatchResponder
}) => {
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
  const dispatchResponse = (request, sender, sendResponse) => {
    if (request.type === DISPATCH_TYPE && request.portName === portName) {
      const action = Object.assign({}, request.payload, {
        _sender: sender
      });

      let dispatchResult = null;

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
  const connectState = (port) => {
    if (port.name !== portName) {
      return;
    }

    /**
     * Send store's current state through port
     * @return undefined
     */
    const sendState = () => {
      port.postMessage({
        type: STATE_TYPE,
        payload: store.getState()
      });
    };

    // Send new state down connected port on every redux store state change
    const unsubscribe = store.subscribe(sendState);

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
