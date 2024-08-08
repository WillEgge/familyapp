import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`h-${size} w-${size} animate-spin text-primary`} />
    </div>
  );
};

export default LoadingSpinner;