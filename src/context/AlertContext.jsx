import { createContext, useCallback, useContext, useState } from 'react';
import Modal from '../components/Modal';

const AlertContext = createContext(null);

/**
 * Provides an `alert(message, options)` function (in place of the
 * browser's window.alert) that shows a branded modal dialog with a
 * single "OK" button.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AlertProvider({ children }) {
  const [request, setRequest] = useState(null);

  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setRequest({
        message,
        title: options.title || 'Please note',
        okLabel: options.okLabel || 'OK',
        resolve,
      });
    });
  }, []);

  function respond() {
    request.resolve();
    setRequest(null);
  }

  return (
    <AlertContext.Provider value={alert}>
      {children}
      {request && (
        <Modal onClose={respond}>
          <h2>{request.title}</h2>
          <p>{request.message}</p>
          <div className="form-actions">
            <button type="button" onClick={respond} autoFocus>
              {request.okLabel}
            </button>
          </div>
        </Modal>
      )}
    </AlertContext.Provider>
  );
}

/** @returns {(message: string, options?: {title?: string, okLabel?: string}) => Promise<void>} */
// eslint-disable-next-line react-refresh/only-export-components
export function useAlert() {
  return useContext(AlertContext);
}
