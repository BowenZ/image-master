import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DropZone = ({
  fileList,
  children,
  onAddFile,
}: {
  fileList?: File[];
  children: React.ReactNode;
  onAddFile: (fileList: File[]) => void;
}) => {
  const [dragState, setDragState] = useState('');
  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    console.log('====handleDrop====', e);
    console.log('====drop files====', e.dataTransfer.files);
    setDragState(e.type);
    if (fileList && fileList.length) {
      const filteredFiles = Array.from(e.dataTransfer.files).filter((item) => {
        return !fileList.some((pItem) => pItem.path === item.path);
      });
      if (filteredFiles.length) {
        onAddFile(filteredFiles);
      }
    } else {
      onAddFile(Array.from(e.dataTransfer.files));
    }
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
      className={`drop-zone ${dragState === 'dragover' ? 'active' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      拖拽图片到此 {dragState}
      {children}
    </Wrapper>
  );
};

export default DropZone;

const Wrapper = styled.div`
  margin: 20px 0;
  /* height: 300px; */
  border: 1px dashed;
  padding: 20px;
  &.active {
    border-color: red;
  }
`;
