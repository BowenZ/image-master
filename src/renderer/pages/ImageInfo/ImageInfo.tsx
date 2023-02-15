import { ChannelsEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import DropZone from 'renderer/components/DropZone';
import styled from 'styled-components';
import EXIF from 'exif-js';
import metaDataMap from './metaDataMap';

const ImageInfo: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File>();

  const [imgMetadata, setImgMetadata] = useState<Recordable | null>(null);

  const handleAddFile = (files: File[]): void => {
    setCurrentFile(files[0]);
  };

  const handleClickGetImgInfo = (): void => {
    if (currentFile?.path) {
      window.electron.ipcRenderer.sendMessage(ChannelsEnum.GET_IMAGE_INFO, {
        filePath: currentFile.path,
      });

      EXIF.getData(currentFile.path, () => {
        console.log('====EXIF====');
        const allMetaData = EXIF.getAllTags(this);
        console.log('====allMetaData====', allMetaData);
      });
    }
  };
  // http://api.map.baidu.com/geocoder?location=29.556647222222225,106.53427777777777&coord_type=wgs84&output=html&src=webapp.baidu.openAPIdemo
  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.GET_IMAGE_INFO, (arg: any) => {
      console.log('====GET_IMAGE_INFO====', arg);
      setImgMetadata(arg.info);
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
      <table className="mt-4">
        <tbody>
          {imgMetadata
            ? metaDataMap.map((item) => {
                if (item.key === 'divider') {
                  return (
                    <tr key={item.label}>
                      <td colSpan={2}>
                        <strong>{item.label}</strong>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={item.key}>
                    <td>{item.label}</td>
                    <td>
                      {(() => {
                        if (item.render) {
                          return item.render(
                            imgMetadata[item.key],
                            imgMetadata
                          );
                        }
                        const thisValue = imgMetadata[item.key];
                        if (
                          typeof thisValue?.description === 'string' ||
                          typeof thisValue?.description === 'number'
                        ) {
                          return thisValue?.description;
                        }
                        return thisValue;
                      })()}
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default ImageInfo;

const Wrapper = styled.div`
  table {
    td {
      border: 1px solid #000;
      padding: 2px 4px;
    }
  }
`;
