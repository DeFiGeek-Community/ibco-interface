import { format } from 'date-fns';
import { Circle } from 'rc-progress';
import CountdownCalendar from './CountdownCalendar';

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
    <div
      style={{
        position: 'relative',
        minWidth: '600px',
        marginLeft: '50px',
      }}
    >
      <Circle
        percent={getRestTermPercetage()}
        strokeWidth={4}
        strokeColor="#D3D3D3"
      />

      {unixStartDate * 1000 > Date.now() ? (
        <span
          style={{
            display: 'inline-block',
            position: 'absolute',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            top: 260,
            left: 50,
          }}
        >
          {format(unixStartDate * 1000, 'yyyy年MM月dd日HH時mm分より開始！')}
        </span>
      ) : (
        <span
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: 200,
            left: 50,
          }}
        >
          <CountdownCalendar unixEndDate={unixEndDate}></CountdownCalendar>
        </span>
      )}
    </div>
  );
}
