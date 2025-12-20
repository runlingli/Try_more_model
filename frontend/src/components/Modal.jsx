import React from 'react';
import CloseIcon from '../assets/close-button.svg'


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      // fixed inset-0 overlay the entire screen
      onClick={onClose}
    >
      <div
        className="bg-white/10 rounded-xl shadow-lg max-w-240 relative p-2 m-4"
        onClick={(e) => e.stopPropagation()}
      > 
        <div className='p-6 scrollbar-none overflow-y-auto max-h-[70vh]'>
          <button
            className="absolute top-2 right-2 text-white rounded"
            onClick={onClose}
          >
            <img src={CloseIcon} alt="Close" className='w-5 h-5 cursor-pointer' />
          </button>
          <div className='text-white font-ma'>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal
