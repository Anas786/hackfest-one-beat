import styled from "styled-components";

export const ActionWrapper = styled.div`
  display: inline-block;
  font-size: 15px;
  color: #f5222d;
  cursor: pointer;
  & a {
    margin-right: 18px;
    color: green;
  }
  &.update span,
  &.preview {
    display: inline-block;
    margin-right: 20px;
    color: #0051e7 !important;
  }
`;
