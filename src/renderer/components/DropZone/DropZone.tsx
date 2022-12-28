import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DropZone = ({ onChange }: { onChange: (fileList: File[]) => void }) => {
  const [dragState, setDragState] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);

  useEffect(() => {
    onChange(fileList);
  }, [fileList, onChange]);

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    console.log('====handleDrop====', e);
    console.log('====drop files====', e.dataTransfer.files);
    setDragState(e.type);
    setFileList((p) => {
      const filteredFiles = Array.from(e.dataTransfer.files).filter((item) => {
        return !p.some((pItem) => pItem.path === item.path);
      });
      if (filteredFiles.length) {
        return [...p, ...filteredFiles];
      }
      return p;
    });
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragState(e.type);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    console.log('====handleDragLeave====', e);
    setDragState(e.type);
  };

  return (
    <Wrapper
      className={dragState === 'dragover' ? 'active' : ''}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      DropZone {dragState}
      <ul>
        {fileList.map((item) => (
          <li key={item.path}>{item.name}</li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default DropZone;

const Wrapper = styled.div`
  margin: 20px 0;
  height: 300px;
  border: 1px dashed;
  padding: 20px;
  &.active {
    border-color: red;
  }
`;
