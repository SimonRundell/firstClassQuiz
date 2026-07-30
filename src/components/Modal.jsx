import { useEffect } from 'react';

/**
 * Generic modal shell: dimmed overlay, centered card with the Exeter
 * College logo, closes on Escape or clicking outside the card.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {() => void} props.onClose
 * @param {string} [props.className] - extra class(es) on the card, e.g. for a wider modal
 */
export default function Modal({ children, onClose, className = '' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-card ${className}`} onClick={(e) => e.stopPropagation()}>
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="modal-logo" />
        {children}
      </div>
    </div>
  );
}
