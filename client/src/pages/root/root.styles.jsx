import styled from "styled-components";
export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`
export const OutletWrapper = styled.div`
  width: 100vw;
  max-width: 1920px;
  flex-grow: 1;
  
  @media (max-width: 1023px) {
    padding-left: 0;
  }
`