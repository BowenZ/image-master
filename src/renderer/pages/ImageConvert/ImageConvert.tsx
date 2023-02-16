import { Form } from 'antd';
import { Schemas } from 'main/common/network';
import { ChannelsEnum, ImgStatusEnum } from 'main/types';
import prettyBytes from 'pretty-bytes';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import styled from 'styled-components';
import ConfigForm from './children/ConfigForm';

const ImageConvert: React.FC = () => {
  const [fileList, setFileList] = useState<
    (File & {
      status?: ImgStatusEnum;
      destinationPath?: string;
      destinationSize?: number;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleAddFile = (files: File[]): void => {
    console.log('====handleAddFile====', files);
    setFileList((p) => {
      return [...p, ...files];
    });
  };

  const handleClickRemote = (path: string): void => {
    setFileList((p) => {
      return p.filter((item) => item.path !== path);
    });
  };

  const handleClickGo = (): void => {
    console.log('====handleClickGo====');
    console.log('====form value====', form.getFieldsValue());
    if (!fileList.length) {
      return;
    }
    setIsLoading(true);
    const config = form.getFieldsValue();
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.IMAGE_CONVERT, {
      filePathList: fileList.map((item) => item.path),
      config,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.IMAGE_CONVERT, (arg) => {
      // eslint-disable-next-line no-console
      console.log('COMPRESS_IMAGE:', arg);
      const { status, sourcePath, destinationPath, destinationSize } = arg as {
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
            item.destinationPath = destinationPath;
            item.destinationSize = destinationSize;
          }
          return item;
        });
      });
    });
  }, []);

  return (
    <Wrapper>
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
              <span>{item.status}</span>
              <button
                type="button"
                onClick={() => {
                  handleClickRemote(item.path);
                }}
              >
                移除
              </button>
            </li>
          ))}
        </FileList>
      </DropZone>
      <ConfigForm form={form} />
      <button type="button" disabled={!fileList.length} onClick={handleClickGo}>
        开始转换
      </button>
    </Wrapper>
  );
};

export default ImageConvert;

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
