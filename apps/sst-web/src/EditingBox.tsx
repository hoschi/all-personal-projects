import React from "react";

interface EditingBoxProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const EditingBox: React.FC<EditingBoxProps> = ({
  text,
  onTextChange,
}) => {
  return (
    <textarea value={text} onChange={(e) => onTextChange(e.target.value)} />
  );
};
