import React from "react";
import packageInfo from "../package.json";

const VersionInfo: React.FC = () => {
  return (
    <div className="fixed bottom-2 right-2 text-[8px] text-gray-400 opacity-50">
      v{packageInfo.version}
    </div>
  );
};

export default VersionInfo;