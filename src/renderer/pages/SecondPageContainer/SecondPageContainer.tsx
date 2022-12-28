import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SecondPageContainer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <button
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      >
        后退
      </button>
      <Outlet />
    </Wrapper>
  );
};

export default SecondPageContainer;

const Wrapper = styled.div`
  padding: 20px;
  height: 100vh;
  background: linear-gradient(
    200.96deg,
    #fedc2a -29.09%,
    #dd5789 51.77%,
    #7a2c9e 129.35%
  );
`;
