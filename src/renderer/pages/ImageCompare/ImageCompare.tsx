import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DropZone from 'renderer/components/DropZone';
import { getLocalImagePath, Schemas } from 'main/common/network';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { getUrlParams } from 'renderer/utils/commonTools';

const ImageCompare = () => {
  const [leftImg, setLeftImg] = useState('');
  const [rightImg, setRightImg] = useState('');
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  useEffect(() => {
    const urlParams = getUrlParams();
    console.log('====urlParams====', urlParams);
    if (urlParams.oldFilePath && urlParams.newFilePath) {
      setLeftImg(urlParams.oldFilePath);
      setRightImg(urlParams.newFilePath);
    }
  }, []);

  const handleLeftFileChange = (files: File[]): void => {
    if (files.length) {
      setLeftImg(files[0].path);
    }
  };

  const handleRightFileChange = (files: File[]): void => {
    if (files.length) {
      setRightImg(files[0].path);
    }
  };

  const handleToggleDirection = (): void => {
    setDirection((p) => {
      return p === 'horizontal' ? 'vertical' : 'horizontal';
    });
  };

  return (
    <Wrapper>
      {!leftImg || !rightImg ? (
        <div className="drop-container">
          <div className="drop-left">
            <DropZone onAddFile={handleLeftFileChange}>
              {leftImg ? <img src={getLocalImagePath(leftImg)} alt="" /> : null}
            </DropZone>
          </div>
          <div className="drop-right">
            <DropZone onAddFile={handleRightFileChange}>
              {rightImg ? (
                <img src={getLocalImagePath(rightImg)} alt="" />
              ) : null}
            </DropZone>
          </div>
        </div>
      ) : (
        <div className="compare-container">
          <button type="button" onClick={handleToggleDirection}>
            视图模式{direction}
          </button>
          <ImgComparisonSlider hover direction={direction}>
            <img slot="first" src={getLocalImagePath(leftImg)} />
            <img slot="second" src={getLocalImagePath(rightImg)} />
          </ImgComparisonSlider>
        </div>
      )}
    </Wrapper>
  );
};

export default ImageCompare;

const Wrapper = styled.div`
  .drop-container {
    display: flex;
    .drop-left,
    .drop-right {
      flex: 1;
    }
    .drop-zone {
      min-height: 300px;
    }
  }
  .compare-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;
