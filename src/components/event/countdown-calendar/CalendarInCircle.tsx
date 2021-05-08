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
  const getRestTermPercetage = () => {
    const now = Date.now() / 1000;
    const duration = unixEndDate - unixStartDate;
    const rest = now - unixStartDate;
    return (rest / duration) * 100;
  };

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
    </div>
  );
}
