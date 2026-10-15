import React from 'react';
import { m } from 'framer-motion';
import { FloralCorner, FloralEmblem } from './Florals';
import { HeartIcon } from './Icons';
import { CELEBRATION, CONTRACT } from '../content/wedding';
import { reveal } from '../motion';
import './BigDay.css';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const parse = (iso: string) => iso.split('-').map(Number) as [number, number, number];

// the marriage contract's month drives the calendar; both events fall in it (October 2026)
const [YEAR, MONTH] = parse(CONTRACT.dateTime);
const monthName = new Date(YEAR, MONTH - 1, 1).toLocaleString('en-GB', { month: 'long' });
const daysInMonth = new Date(YEAR, MONTH, 0).getDate();
const leadingBlanks = (new Date(YEAR, MONTH - 1, 1).getDay() + 6) % 7; // Monday-first week

// days held in a heart, with what happens on each
const EVENTS = [CONTRACT, CELEBRATION]
  .map((e) => ({ iso: e.dateTime, day: parse(e.dateTime)[2], label: e.title }))
  .filter((e) => parse(e.iso)[1] === MONTH);
const eventOn = (day: number) => EVENTS.find((e) => e.day === day);

/** Heading changes with the visitor's own date, so it is never wrong */
const moment = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const times = EVENTS.map((e) => new Date(YEAR, MONTH - 1, e.day).getTime());
  if (times.includes(today)) return { title: 'Today is the Day', sub: 'Thank you for celebrating with us', closing: 'A beautiful journey begins today…' };
  if (today < Math.max(...times)) return { title: 'Save the Dates', sub: 'We can’t wait to celebrate with you', closing: 'A beautiful journey is about to begin…' };
  return { title: 'Thank You', sub: 'For celebrating our beginning with us', closing: 'Our beautiful journey has begun…' };
};

const BigDay: React.FC = () => {
  const copy = moment();
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="bigday" id="the-day" aria-labelledby="bigday-title">
      {/* desktop: large faint bouquets filling the space beside the card */}
      <FloralCorner className="bigday__side bigday__side--left" />
      <FloralCorner className="bigday__side bigday__side--right" />

      <m.div className="bigday__card" {...reveal()}>
        <FloralCorner className="bigday__floral bigday__floral--top" />
        <FloralCorner className="bigday__floral bigday__floral--bottom" />
        <span className="bigday__frame" aria-hidden="true" />

        <div className="bigday__intro">
          <FloralEmblem className="bigday__emblem" />
          <span className="bigday__eyebrow">The Big Day</span>
          <div className="ornament bigday__ornament" aria-hidden="true"><HeartIcon /></div>

          <h2 id="bigday-title" className="bigday__title">{copy.title}</h2>
          <p className="bigday__sub">{copy.sub}</p>
        </div>

        <div className="calendar">
          <p className="calendar__month" id="calendar-month">{monthName} {YEAR}</p>
          <ol className="calendar__weekdays" aria-hidden="true">
            {WEEKDAYS.map((d) => <li key={d}>{d}</li>)}
          </ol>
          <ol className="calendar__grid" aria-labelledby="calendar-month">
            {cells.map((d, i) => {
              if (d === null) return <li key={`blank-${i}`} aria-hidden="true" />;
              const event = eventOn(d);
              return event ? (
                <li key={d} className="calendar__day calendar__day--event">
                  <HeartIcon className="calendar__heart" />
                  <time dateTime={event.iso}>{d}</time>
                  <span className="sr-only">
                    {' '}— {WEEKDAY_NAMES[i % 7]}, {event.label}
                  </span>
                </li>
              ) : (
                <li key={d} className="calendar__day">{d}</li>
              );
            })}
          </ol>
          <ul className="calendar__legend" aria-hidden="true">
            {EVENTS.map((e) => (
              <li key={e.iso}>
                <HeartIcon />
                <span><strong>{e.day}</strong> {e.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bigday__outro">
          <p className="bigday__closing">{copy.closing}</p>
          <div className="ornament bigday__ornament" aria-hidden="true"><HeartIcon /></div>
        </div>
      </m.div>
    </section>
  );
};

export default BigDay;
