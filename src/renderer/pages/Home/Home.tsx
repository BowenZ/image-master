import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import icon from '#/icon.svg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 className="text-xl">图片大师</h1>
      <div className="Hello">
        <button
          type="button"
          className="mr-4"
          onClick={() => {
            navigate('/pages/img-compress');
          }}
        >
          图片压缩
        </button>
        {/* <button
          type="button"
          className="mr-4"
          onClick={() => {
            navigate('/pages/img-diff');
          }}
        >
          图片差异
        </button> */}
        {/* <button
          type="button"
          className="mr-4"
          onClick={() => {
            navigate('/pages/img-crop');
          }}
        >
          图片裁剪
        </button> */}
        <button
          type="button"
          className="mr-4"
          onClick={() => {
            navigate('/pages/img-convert');
          }}
        >
          格式转换
        </button>
        <button
          type="button"
          className="mr-4"
          onClick={() => {
            navigate('/pages/img-compare');
          }}
        >
          图片对比
        </button>
        <button
          type="button"
          onClick={() => {
            navigate('/pages/img-info');
          }}
        >
          图片信息
        </button>
      </div>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  position: relative;
  color: white;
  height: 100vh;
  background: linear-gradient(
    200.96deg,
    #fedc2a -29.09%,
    #dd5789 51.77%,
    #7a2c9e 129.35%
  );
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .Hello {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    color: #333;
  }
`;
