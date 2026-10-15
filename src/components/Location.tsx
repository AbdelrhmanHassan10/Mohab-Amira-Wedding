import React from 'react';
import { m } from 'framer-motion';
import Photo from './Photo';
import { ArrowUpRightIcon, CalendarIcon, CheersIcon, PinIcon, RingsIcon, Sprig } from './Icons';
import { CELEBRATION, CONTRACT, LOCATION, directionsUrl } from '../content/wedding';
import { reveal } from '../motion';
import './Location.css';

interface PlaceProps {
  icon: React.ReactNode;
  event: string;
  venue: string;
  address: string;
  when: React.ReactNode;
  mapUrl: string;
  /** shown when the link is only a search, not an exact pin */
  note?: string;
}

const Place: React.FC<PlaceProps> = ({ icon, event, venue, address, when, mapUrl, note }) => (
  <li className="place">
    <span className="place__icon">{icon}</span>
    <div className="place__body">
      <span className="place__event">{event}</span>
      <h3 className="place__venue">{venue}</h3>
      <p className="place__line"><PinIcon /> {address}</p>
      <p className="place__line"><CalendarIcon /> {when}</p>
      <a className="text-link place__link" href={mapUrl} target="_blank" rel="noopener noreferrer">
        <span>Get Directions</span>
        <ArrowUpRightIcon />
        <span className="sr-only">to {venue} (opens Google Maps in a new tab)</span>
      </a>
      {note && <p className="place__note">{note}</p>}
    </div>
  </li>
);

const Location: React.FC = () => (
  <section className="location" id="location" aria-labelledby="location-title">
    <div className="location__inner container">
      <m.div className="location__media" {...reveal()}>
        <Photo
          name="mosque-exterior"
          alt="The Grand Mosque in Beni Suef lit up at night, with its tall tiled minaret and blue domes"
          sizes="(max-width: 860px) 92vw, 640px"
          position="28% 60%"
        />
      </m.div>

      <m.div className="location__text" {...reveal(0.12)}>
        <span className="eyebrow">Our Locations</span>
        <h2 id="location-title" className="location__title">
          Where to Find Us
          <span>East Nile, Beni Suef</span>
        </h2>

        <ul className="location__places">
          <Place
            icon={<RingsIcon />}
            event={CONTRACT.title}
            venue={LOCATION.venue}
            address={LOCATION.address}
            when={<><time dateTime={CONTRACT.dateTime}>{CONTRACT.date}</time> · {CONTRACT.time}</>}
            mapUrl={directionsUrl()}
            note={LOCATION.mapUrl ? undefined : 'Opens a Google Maps search for the mosque.'}
          />
          <Place
            icon={<CheersIcon />}
            event={CELEBRATION.title}
            venue={CELEBRATION.venue}
            address={`${CELEBRATION.area}, Egypt`}
            when={<><time dateTime={CELEBRATION.dateTime}>{CELEBRATION.date}</time> · {CELEBRATION.time ?? 'time to be confirmed'}</>}
            mapUrl={CELEBRATION.mapUrl}
          />
        </ul>

        <Sprig className="location__sprig" flip />
      </m.div>
    </div>
  </section>
);

export default Location;
