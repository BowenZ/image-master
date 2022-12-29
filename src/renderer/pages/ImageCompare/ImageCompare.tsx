import React, { useState } from 'react';
import styled from 'styled-components';
import DropZone from 'renderer/components/DropZone';
import { getLocalImagePath, Schemas } from 'main/common/network';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

const ImageCompare = () => {
  const [leftImg, setLeftImg] = useState<File | null>(null);
  const [rightImg, setRightImg] = useState<File | null>(null);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  const handleLeftFileChange = (files: File[]): void => {
    if (files.length) {
      setLeftImg(files[0]);
    }
  };

  const handleRightFileChange = (files: File[]): void => {
    if (files.length) {
      setRightImg(files[0]);
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
            <DropZone
              fileList={leftImg ? [leftImg] : []}
              onAddFile={handleLeftFileChange}
            >
              {leftImg ? (
                <img src={getLocalImagePath(leftImg.path)} alt="" />
              ) : null}
            </DropZone>
          </div>
          <div className="drop-right">
            <DropZone
              fileList={rightImg ? [rightImg] : []}
              onAddFile={handleRightFileChange}
            >
              {rightImg ? (
                <img src={getLocalImagePath(rightImg.path)} alt="" />
              ) : null}
            </DropZone>
          </div>
        </div>
      ) : (
        <div className="compare-container">
          <button type="button" onClick={handleToggleDirection}>
            切换为{direction}
          </button>
          <ImgComparisonSlider hover direction={direction}>
            <img slot="first" src={getLocalImagePath(leftImg.path)} />
            <img slot="second" src={getLocalImagePath(rightImg.path)} />
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
`;
