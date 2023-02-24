import { Button } from 'antd';
import { ChannelsEnum } from 'main/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isString } from 'lodash-es';

const DirSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) => {
  const [dirPath, setDirPath] = useState('');

  useEffect(() => {
    setDirPath(value || '');
  }, [value]);

  const handleClickChooseDir = (): void => {
    window.electron.ipcRenderer.sendMessage(ChannelsEnum.SELECT_DIR);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(ChannelsEnum.SELECT_DIR, (arg) => {
      if (isString(arg)) {
        console.log('SELECT_DIR:', arg);
        setDirPath(arg as string);
        if (onChange) {
          onChange(arg);
        }
      }
    });
  }, [onChange]);

  return (
    <Wrapper>
      <Button onClick={handleClickChooseDir}>选择目录</Button>
      <span>{dirPath}</span>
    </Wrapper>
  );
};

export default DirSelect;

const Wrapper = styled.div``;
