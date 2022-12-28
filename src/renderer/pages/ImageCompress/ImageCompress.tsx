import { ChannelsEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import styled from 'styled-components';

const ImageCompress: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFileChange = (files: File[]): void => {
    setFileList(files);
  };

  const handleClickCompress = (): void => {
    // compressImg(fileList.map((item) => item.path)).then((res) => {
    //   console.log('====compressImg res====', res);
    // });
    window.electron.ipcRenderer.sendMessage(
      'ipc-compress-img',
      fileList.map((item) => item.path)
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.once(ChannelsEnum.COMPRESS_IMAGE, (arg) => {
      // eslint-disable-next-line no-console
      console.log('COMPRESS_IMAGE:', arg);
    });
  }, []);

  return (
    <Wrapper>
      ImageCompress
      <DropZone onChange={handleFileChange} />
      <button type="button" onClick={handleClickCompress}>
        开始压缩
      </button>
    </Wrapper>
  );
};

export default ImageCompress;

const Wrapper = styled.div``;
