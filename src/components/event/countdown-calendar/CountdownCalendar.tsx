import { format } from 'date-fns';
import { useState } from 'react';
import styled from 'styled-components';
import useInterval from '../../../hooks/useInterval';

type Props = {
  unixEndDate: number;
};

type Countdown = { days: string; hours: string; mins: string; secs: string };
const initialCountdown = {
  days: '0',
  hours: '0',
  mins: '0',
  secs: '0',
};

export default function CountdownCalendar({ unixEndDate }: Props) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useInterval(() => {
    if (!unixEndDate) {
      setCountdown({ days: '?', hours: '?', mins: '?', secs: '?' });
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const newCountdown = { ...getCountdown(unixEndDate - now) };
    setCountdown(newCountdown);
  }, 1000);

  return (
    <div>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {' '}
        {format(unixEndDate * 1000, 'yyyy年MM月dd日HH時mm分まで')}
      </p>

      <CountdownPanel>
        <div className="countdown-value">{countdown.days}</div>
        <div className="countdown-unit">DAYS</div>
      </CountdownPanel>
      <CountdownPanel>
        <div className="countdown-value">{countdown.hours}</div>
        <div className="countdown-unit">HOURS</div>
      </CountdownPanel>
      <CountdownPanel>
        <div className="countdown-value">{countdown.mins}</div>
        <div className="countdown-unit">MINS</div>
      </CountdownPanel>
      <CountdownPanel>
        <div className="countdown-value">{countdown.secs}</div>
        <div className="countdown-unit">SECS</div>
      </CountdownPanel>
      {unixEndDate * 1000 < Date.now() && (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '2rem',
            }}
          >
            終了しました🎉
          </span>
        </div>
      )}
    </div>
  );
}

function getCountdown(duration: number): Countdown {
  let restSec = duration;
  const countdown: Countdown = initialCountdown;
  if (restSec >= 86400) {
    countdown.days = Math.floor(restSec / 86400).toString();
    restSec = restSec % 86400;
  }
  if (restSec >= 3600) {
    countdown.hours = Math.floor(restSec / 3600).toString();
    restSec = restSec % 3600;
  }
  if (restSec >= 60) {
    countdown.mins = Math.floor(restSec / 60).toString();
    restSec = restSec % 60;
  }
  countdown.secs = restSec > 0 ? restSec.toString() : '0';

  return countdown;
}

const CountdownPanel = styled.div`
  background: white;
  display: inline-block;
  margin: 10px;
  min-width: 100px;
  padding: 20px 0;
  text-align: center;
  .countdown-value {
    color: black;
    font-size: 2rem;
    margin-bottom: 10px;
  }
  .countdown-unit {
    color: black;
    text-transform: capitalize;
  }
`;
