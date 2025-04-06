import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Side effects for closing the modal when Escape is pressed or clicking outside the modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Add event listeners when modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Clean up event listeners when modal is closed
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Return nothing if modal is not open
  if (!isOpen) return null;

  // Modal JSX structure
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500"
          aria-label="Close"
        >
          &times;
        </button>
        {children} {/* This will render whatever content is passed into the Modal */}
      </div>
    </div>,
    document.body // Portal destination
  );
}
