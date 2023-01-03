import { ChannelsEnum, ImgProcessModeEnum, ImgStatusEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import prettyBytes from 'pretty-bytes';
import styled from 'styled-components';
import { Schemas } from 'main/common/network';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { toPercent } from 'renderer/utils/commonTools';

const compressQualityList = [
  { quality: [0.1, 0.5], label: '低', value: 'low' },
  { quality: [0.5, 0.8], label: '中', value: 'middle' },
  { quality: [0.8, 0.9], label: '高', value: 'high' },
];

const ImageCompress: React.FC = () => {
  const [fileList, setFileList] = useState<
    (File & {
      status?: ImgStatusEnum;
      originalFilePath?: string;
      destinationPath?: string;
      destinationSize?: number;
    })[]
  >([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(compressQualityList[1].quality);
  const [mode, setMode] = useState(ImgProcessModeEnum.REPLACE_FILE);

  const onQualityChange = (e: RadioChangeEvent): void => {
    console.log('====onQualityChange====', e);
    setQuality(e.target.value);
  };

  const onQualityMode = (e: RadioChangeEvent): void => {
    setMode(e.target.value);
  };

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
    console.log('====quality====', quality);
    if (!fileList.length) {
      return;
    }
    setIsCompressing(true);
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.COMPRESS_IMAGE, {
      filePathList: fileList.map((item) => item.path),
      quality,
      mode,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.COMPRESS_IMAGE, (arg) => {
      // eslint-disable-next-line no-console
      console.log('COMPRESS_IMAGE:', arg);
      const {
        status,
        sourcePath,
        originalFilePath,
        destinationPath,
        destinationSize,
      } = arg as {
        status: ImgStatusEnum;
        sourcePath: string;
        originalFilePath: string;
        destinationPath: string;
        destinationSize: number;
      };
      setFileList((p) => {
        return p.map((item) => {
          if (item.path === sourcePath) {
            item.status = status;
            item.originalFilePath = originalFilePath;
            item.destinationPath = destinationPath;
            item.destinationSize = destinationSize;
          }
          return item;
        });
      });
    });

    window.electron.ipcRenderer.on(ChannelsEnum.REVERT_IMAGE, (arg) => {
      // eslint-disable-next-line no-console
      console.log('REVERT_IMAGE:', arg);
      const { status, sourcePath, sourceSize } = arg as {
        status: ImgStatusEnum;
        sourcePath: string;
        sourceSize: number;
      };
      setFileList((p) => {
        return p.map((item) => {
          if (item.path === sourcePath) {
            item.status = status;
            item.destinationPath = sourcePath;
            item.destinationSize = sourceSize;
          }
          return item;
        });
      });
    });
  }, []);

  const handleClickRemote = (path: string): void => {
    setFileList((p) => {
      return p.filter((item) => item.path !== path);
    });
  };

  const handleClickShowDiff = (
    oldFilePath: string,
    newFilePath: string
  ): void => {
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.COMPARE_IMAGE, {
      oldFilePath,
      newFilePath,
    });
  };

  const handleClickRevertImg = (oldFilePath: string): void => {
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.REVERT_IMAGE, {
      oldFilePath,
    });
  };

  return (
    <Wrapper>
      <div>
        <h3>压缩质量</h3>
        <Radio.Group value={quality} onChange={onQualityChange}>
          {compressQualityList.map((item) => (
            <Radio value={item.quality} key={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
        {quality.join('-')}
      </div>
      <div>
        <h3>压缩模式</h3>
        <Radio.Group value={mode} onChange={onQualityMode}>
          <Radio value={ImgProcessModeEnum.REPLACE_FILE}>覆盖源文件</Radio>
          <Radio value={ImgProcessModeEnum.NEW_FILE}>新建文件</Radio>
        </Radio.Group>
      </div>
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
              {item.destinationSize ? (
                <span>
                  <AiOutlineArrowDown />
                  {toPercent((item.size - item.destinationSize) / item.size)}
                </span>
              ) : null}
              <span>{item.status}</span>
              <button
                type="button"
                onClick={() => {
                  handleClickRemote(item.path);
                }}
              >
                移除
              </button>
              {item.destinationPath && item.status === ImgStatusEnum.SUCCESS ? (
                <button
                  type="button"
                  onClick={() => {
                    if (item.destinationPath && item.originalFilePath) {
                      handleClickShowDiff(
                        item.originalFilePath,
                        item.destinationPath
                      );
                    }
                  }}
                >
                  查看差异
                </button>
              ) : null}

              {mode === ImgProcessModeEnum.REPLACE_FILE &&
              item.status === ImgStatusEnum.SUCCESS ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClickRevertImg(item.path);
                  }}
                >
                  还原
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
