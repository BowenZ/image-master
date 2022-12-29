import { ChannelsEnum, ImgStatusEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import prettyBytes from 'pretty-bytes';
import styled from 'styled-components';
import { Schemas } from 'main/common/network';

const ImageCompress: React.FC = () => {
  const [fileList, setFileList] = useState<
    (File & {
      status?: ImgStatusEnum;
      destinationPath?: string;
      destinationSize?: number;
    })[]
  >([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleAddFile = (files: File[]): void => {
    console.log('====handleAddFile====', files);
    setFileList((p) => {
      return [...p, ...files];
    });
  };

  const handleClickCompress = (): void => {
    // compressImg(fileList.map((item) => item.path)).then((res) => {
    //   console.log('====compressImg res====', res);
    // });
    if (!fileList.length) {
      return;
    }
    setIsCompressing(true);
    window.electron.ipcRenderer.sendMessage(
      ChannelsEnum.COMPRESS_IMAGE,
      fileList.map((item) => item.path)
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.COMPRESS_IMAGE, (arg) => {
      // eslint-disable-next-line no-console
      console.log('COMPRESS_IMAGE:', arg);
      const { status, sourcePath, destinationPath, destinationSize } = arg as {
        status: ImgStatusEnum;
        sourcePath: string;
        destinationPath?: string;
        destinationSize?: number;
      };
      setFileList((p) => {
        return p.map((item) => {
          if (item.path === sourcePath) {
            item.status = status;
            item.destinationPath = destinationPath;
            item.destinationSize = destinationSize;
          }
          return item;
        });
      });
    });
  }, []);

  const handleClickShowDiff = (
    oldFilePath: string,
    newFilePath: string
  ): void => {
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.COMPARE_IMAGE, {
      oldFilePath,
      newFilePath,
    });
  };

  return (
    <Wrapper>
      ImageCompress
      <DropZone fileList={fileList} onAddFile={handleAddFile}>
        <FileList>
          {fileList.map((item) => (
            <li key={item.path} className="file-item">
              <img
                src={`${Schemas.fileResourceProtocol}://${item.path}`}
                alt=""
                className="file-thumb"
              />
              <span>{item.name}</span>
              <span>{prettyBytes(item.size)}</span>
              <span>
                {item.destinationSize
                  ? prettyBytes(item.destinationSize)
                  : null}
              </span>
              <span>{item.status}</span>
              {item.destinationPath ? (
                <button
                  type="button"
                  onClick={() => {
                    if (item.destinationPath) {
                      handleClickShowDiff(item.path, item.destinationPath);
                    }
                  }}
                >
                  查看差异
                </button>
              ) : null}
            </li>
          ))}
        </FileList>
      </DropZone>
      <button
        type="button"
        disabled={!fileList.length}
        onClick={handleClickCompress}
      >
        开始压缩
      </button>
    </Wrapper>
  );
};

export default ImageCompress;

const Wrapper = styled.div``;

const FileList = styled.ul`
  .file-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .file-thumb {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    button {
      padding: 0px 5px;
      border-radius: 2px;
      font-size: 13px;
      height: 30px;
    }
  }
`;
