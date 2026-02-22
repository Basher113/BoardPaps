import styled from "styled-components";
export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`
export const OutletWrapper = styled.div`
  width: 100vw;
  flex-grow: 1;
  padding-left: 16rem;
  min-height: 100vh;
  max-width: 1920px;
  @media (max-width: 1023px) {
    padding-left: 0;
  }
`