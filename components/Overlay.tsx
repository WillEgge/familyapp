import React from "react";

interface DarkOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

const DarkOverlay: React.FC<DarkOverlayProps> = ({ isVisible, onClick }) => {
  return (
    <div
      className={`
        fixed inset-0 bg-black bg-opacity-50 z-40 
        transition-opacity duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClick}
    />
  );
};

export default DarkOverlay;
