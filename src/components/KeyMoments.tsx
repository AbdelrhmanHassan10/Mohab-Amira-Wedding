import React from 'react';
import { m } from 'framer-motion';
import Photo, { type PhotoName } from './Photo';
import SectionHeading from './SectionHeading';
import { ArrowUpRightIcon, CalendarIcon, CheersIcon, PinIcon, RingsIcon, Sprig } from './Icons';
import { CELEBRATION, CONTRACT } from '../content/wedding';
import { reveal } from '../motion';
import './KeyMoments.css';

interface EventCardProps {
  id: string;
  index: string;
  label: string;
  title: string;
  icon: React.ReactNode;
  when: React.ReactNode;
  whenSub: React.ReactNode;
  /** marks the time as not yet announced */
  pending?: boolean;
  where: string;
  whereSub: string;
  /** exact map pin: adds a "View location" link under the place */
  mapUrl?: string;
  photo: { name: PhotoName; alt: string; position: string };
  delay?: number;
}

/** One event: full-bleed photo card with a gold inner frame and a frosted details panel */
const EventCard: React.FC<EventCardProps> = ({
  id, index, label, title, icon, when, whenSub, pending, where, whereSub, mapUrl, photo, delay = 0,
}) => (
  <m.article className="event" aria-labelledby={id} {...reveal(delay)}>
    <Photo
      name={photo.name}
      alt={photo.alt}
      position={photo.position}
      className="event__photo"
      sizes="(max-width: 900px) 92vw, 600px"
    />
    <span className="event__shade" aria-hidden="true" />
    <span className="event__frame" aria-hidden="true" />

    <div className="event__top">
      <span className="event__icon">{icon}</span>
      <span className="event__index" aria-hidden="true">{index}</span>
    </div>

    <div className="event__content">
      <span className="event__label">{label}</span>
      <h3 id={id} className="event__title">{title}</h3>

      <dl className="event__facts">
        <div className="fact">
          <dt><CalendarIcon /> When</dt>
          <dd>
            <span className="fact__main">{when}</span>
            <span className={`fact__sub${pending ? ' fact__sub--pending' : ''}`}>{whenSub}</span>
          </dd>
        </div>
        <div className="fact">
          <dt><PinIcon /> Where</dt>
          <dd>
            <span className="fact__main">{where}</span>
            <span className="fact__sub">{whereSub}</span>
            {mapUrl && (
              <a className="event__map" href={mapUrl} target="_blank" rel="noopener noreferrer">
                View location <ArrowUpRightIcon />
                <span className="sr-only">of {where} (opens Google Maps in a new tab)</span>
              </a>
            )}
          </dd>
        </div>
      </dl>
    </div>
  </m.article>
);

const KeyMoments: React.FC = () => (
  <section className="moments" id="details" aria-labelledby="details-title">
    <Sprig className="moments__sprig" />

    <div className="container">
      <SectionHeading id="details-title" eyebrow="The Details" title="Key Moments" className="moments__heading" />

      <div className="moments__grid">
        <EventCard
          id="contract-title"
          index="01"
          label="The Ceremony"
          title={CONTRACT.title}
          icon={<RingsIcon />}
          when={<time dateTime={CONTRACT.dateTime}>{CONTRACT.date}</time>}
          whenSub={CONTRACT.time}
          where={CONTRACT.venue}
          whereSub={CONTRACT.area}
          photo={{ name: 'mosque-interior', alt: 'The carved arches and chandelier inside The Grand Mosque, Beni Suef', position: '50% 30%' }}
        />
        {/* time shows "to be confirmed" until set in content/wedding.ts */}
        <EventCard
          id="celebration-title"
          index="02"
          label="The Celebration"
          title={CELEBRATION.title}
          icon={<CheersIcon />}
          when={<time dateTime={CELEBRATION.dateTime}>{CELEBRATION.date}</time>}
          whenSub={CELEBRATION.time ?? 'Time to be confirmed'}
          pending={!CELEBRATION.time}
          where={CELEBRATION.venue}
          whereSub={CELEBRATION.area}
          mapUrl={CELEBRATION.mapUrl}
          photo={{ name: 'garden-house', alt: 'A family home garden glowing with warm lights at dusk', position: '50% 55%' }}
          delay={0.12}
        />
      </div>
    </div>
  </section>
);

export default KeyMoments;
