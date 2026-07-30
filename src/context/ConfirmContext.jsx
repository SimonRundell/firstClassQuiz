import { createContext, useCallback, useContext, useState } from 'react';
import Modal from '../components/Modal';

const ConfirmContext = createContext(null);

/**
 * Provides a `confirm(message, options)` function (in place of the
 * browser's window.confirm) that shows a branded modal dialog and
 * resolves to true/false based on the user's choice.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setRequest({
        message,
        title: options.title || 'Please confirm',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        danger: !!options.danger,
        resolve,
      });
    });
  }, []);

  function respond(result) {
    request.resolve(result);
    setRequest(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && (
        <Modal onClose={() => respond(false)}>
          <h2>{request.title}</h2>
          <p>{request.message}</p>
          <div className="form-actions">
            <button
              type="button"
              className={request.danger ? 'danger-button' : ''}
              onClick={() => respond(true)}
              autoFocus
            >
              {request.confirmLabel}
            </button>
            <button type="button" onClick={() => respond(false)}>
              {request.cancelLabel}
            </button>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
}

/** @returns {(message: string, options?: {title?: string, confirmLabel?: string, cancelLabel?: string, danger?: boolean}) => Promise<boolean>} */
// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  return useContext(ConfirmContext);
}
