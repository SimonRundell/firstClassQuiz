import { useEffect } from 'react';

/**
 * Generic modal shell: dimmed overlay, centered card with the Exeter
 * College logo, closes on Escape or clicking outside the card.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {() => void} props.onClose
 */
export default function Modal({ children, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="modal-logo" />
        {children}
      </div>
    </div>
  );
}
