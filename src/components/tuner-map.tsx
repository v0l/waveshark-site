import { useEffect, useRef } from 'preact/hooks';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import type { Station } from '../directory';

type Leaflet = typeof import('leaflet');

interface Props {
  stations: Station[];
  selected?: string;
  onSelect: (author: string) => void;
}

interface Cell {
  lat: number;
  lon: number;
  stations: Station[];
}

function cells(stations: Station[]): Cell[] {
  const by = new Map<string, Cell>();
  for (const s of stations) {
    if (!s.location || !s.geohash) continue;
    const cell = by.get(s.geohash) ?? { ...s.location, stations: [] };
    cell.stations.push(s);
    by.set(s.geohash, cell);
  }
  return [...by.values()];
}

export function TunerMap({ stations, selected, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const leaflet = useRef<{ L: Leaflet; map: LeafletMap; layer: LayerGroup }>();
  const fitted = useRef(false);
  const select = useRef(onSelect);
  select.current = onSelect;
  const redraw = useRef(() => {});

  useEffect(() => {
    let gone = false;
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([mod]) => {
      if (gone || !host.current) return;
      const L = (mod as unknown as { default?: Leaflet }).default ?? (mod as Leaflet);
      const map = L.map(host.current, {
        center: [30, 0],
        zoom: 2,
        minZoom: 2,
        worldCopyJump: true,
        scrollWheelZoom: false,
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur', () => map.scrollWheelZoom.disable());
      leaflet.current = { L, map, layer: L.layerGroup().addTo(map) };
      redraw.current();
    });
    return () => {
      gone = true;
      leaflet.current?.map.remove();
      leaflet.current = undefined;
    };
  }, []);

  const draw = () => {
    const held = leaflet.current;
    if (!held) return;
    const { L, map, layer } = held;
    layer.clearLayers();
    const all = cells(stations);
    for (const c of all) {
      const picked = c.stations.some(s => s.author === selected);
      const many = c.stations.length > 1;
      const icon = L.divIcon({
        className: `pin${picked ? ' pin-on' : ''}`,
        html: many ? `<span>${c.stations.length}</span>` : '<span></span>',
        iconSize: many ? [26, 26] : [16, 16],
      });
      const label = c.stations.map(s => s.name || s.host).join(', ');
      const marker = L.marker([c.lat, c.lon], { icon, title: label, keyboard: true, riseOnHover: true });
      marker.on('click', () => {
        const at = c.stations.findIndex(s => s.author === selected);
        select.current(c.stations[(at + 1) % c.stations.length].author);
      });
      layer.addLayer(marker);
    }
    if (!fitted.current && all.length) {
      fitted.current = true;
      if (all.length === 1) map.setView([all[0].lat, all[0].lon], 6);
      else map.fitBounds(L.latLngBounds(all.map(c => [c.lat, c.lon])), { padding: [40, 40], maxZoom: 7 });
    }
  };

  redraw.current = draw;
  useEffect(draw, [stations, selected]);

  useEffect(() => {
    const held = leaflet.current;
    const at = stations.find(s => s.author === selected)?.location;
    if (held && at && !held.map.getBounds().pad(-0.1).contains([at.lat, at.lon])) {
      held.map.flyTo([at.lat, at.lon], Math.max(held.map.getZoom(), 6), { duration: 0.6 });
    }
  }, [selected]);

  return <div ref={host} class="tuner-map" role="region" aria-label="Map of listed stations" />;
}
