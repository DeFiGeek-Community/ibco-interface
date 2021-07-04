import { format } from 'date-fns';
import { Circle } from 'rc-progress';
import styled from 'styled-components';
import CountdownCalendar from './CountdownCalendar';

const RightCirclePosition = styled.div`
  position: relative;
  min-width: 600px;
  margin-left: 50px;

  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    margin-left: 0;
  }
`;

const InnerPosition = styled.span`
  display: inline-block;
  position: absolute;
  top: 200px;
  left: 50px;

  @media (max-width: 600px) {
    top: 25%;
    left: 10%;
  }
`;

const BeforeStartStatement = styled.span`
  display: inline-block;
  position: absolute;
  font-size: 1.8rem;
  font-weight: bold;
  top: 40%;
  left: 50px;

  @media (max-width: 600px) {
    left: 10px;
  }
`;

type Props = {
  unixStartDate: number;
  unixEndDate: number;
};

export default function CalendarInCircle({
  unixStartDate,
  unixEndDate,
}: Props) {
  function getRestTermPercetage() {
    const now = Math.floor(Date.now() / 1000);
    const duration = unixEndDate - unixStartDate;
    const rest = now - unixStartDate;
    return rest > 0 ? (rest / duration) * 100 : 0;
  }

  return (
    <RightCirclePosition>
      <Circle
        percent={getRestTermPercetage()}
        strokeWidth={4}
        strokeColor="#D3D3D3"
      />

      {unixStartDate * 1000 > Date.now() ? (
        <BeforeStartStatement>
          {format(unixStartDate * 1000, 'yyyy年MM月dd日HH時mm分より開始！')}
        </BeforeStartStatement>
      ) : (
        <InnerPosition>
          <CountdownCalendar unixEndDate={unixEndDate}></CountdownCalendar>
        </InnerPosition>
      )}
    </RightCirclePosition>
  );
}
