import React from 'react';

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute -top-12 -right-2 text-white/80 hover:text-white text-3xl transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          &times;
        </button>
        <img 
          src={src} 
          alt="Preview" 
          className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white/10"
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
};
