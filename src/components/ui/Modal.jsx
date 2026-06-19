import { X } from 'lucide-react';

export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal" role="dialog">
        <div className="modal__header">
          <h2>{title}</h2>
          <button aria-label="Close modal" className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
