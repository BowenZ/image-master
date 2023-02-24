import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import fileExtension from 'file-extension';
import { message } from 'antd';

const imgExtNames = [
  'avif',
  'gif',
  'heif',
  'jpeg',
  'jpg',
  'jp2',
  'jxl',
  'png',
  'svg',
  'tiff',
  'tif',
  'webp',
];

const DropZone = ({
  fileList,
  children,
  availableExtNames = imgExtNames,
  onAddFile,
}: {
  fileList?: File[];
  availableExtNames?: string[];
  children: React.ReactNode;
  onAddFile: (fileList: File[]) => void;
}) => {
  const [dragState, setDragState] = useState('');
  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    console.log('====handleDrop====', e);
    console.log('====drop files====', e.dataTransfer.files);
    setDragState(e.type);
    let addFileList: File[] = [];
    if (fileList && fileList.length) {
      const filteredFiles = Array.from(e.dataTransfer.files).filter((item) => {
        return !fileList.some((pItem) => pItem.path === item.path);
      });
      if (filteredFiles.length) {
        addFileList = filteredFiles;
      }
    } else {
      addFileList = Array.from(e.dataTransfer.files);
    }
    const availableFiles = addFileList.filter((item) => {
      return availableExtNames.some(
        (extItem) => fileExtension(item.path) === extItem
      );
    });

    if (availableFiles.length === 0) {
      message.info('文件格式不支持，请重新选择');
    } else if (availableFiles.length < addFileList.length) {
      message.info('已过滤不支持的文件格式');
    }

    onAddFile(availableFiles);
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
