import React from 'react';
import styled from 'styled-components';

const OpenMapByLocation = ({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) => {
  const handleClickOpen = (): void => {
    if (!longitude || !latitude) {
      alert('坐标信息无效');
      return;
    }

    window.open(
      `http://api.map.baidu.com/geocoder?location=${latitude},${longitude}&coord_type=wgs84&output=html&src=webapp.baidu.openAPIdemo`
    );
  };
  return (
    <Wrapper>
      <button type="button" onClick={handleClickOpen}>
        打开地图位置
      </button>
    </Wrapper>
  );
};

export default OpenMapByLocation;

const Wrapper = styled.div``;
