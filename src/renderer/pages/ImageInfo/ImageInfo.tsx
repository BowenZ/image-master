import { ChannelsEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import styled from 'styled-components';

const ImageInfo: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File>();

  const handleAddFile = (files: File[]): void => {
    setCurrentFile(files[0]);
  };

  const handleClickGetImgInfo = (): void => {
    if (currentFile?.path) {
      window.electron.ipcRenderer.sendMessage(ChannelsEnum.GET_IMAGE_INFO, {
        filePath: currentFile.path,
      });
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.GET_IMAGE_INFO, (arg) => {
      console.log('====GET_IMAGE_INFO====', arg);
    });
  }, []);

  return (
    <Wrapper>
      <DropZone onAddFile={handleAddFile}>
        <div v-if={currentFile}>{currentFile?.name}</div>
      </DropZone>
      <button type="button" onClick={handleClickGetImgInfo}>
        获取图片信息
      </button>
    </Wrapper>
  );
};

export default ImageInfo;

const Wrapper = styled.div``;
