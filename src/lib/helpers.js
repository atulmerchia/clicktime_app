import React from 'react';

class Helpers {};

const radians = n => n * Math.PI / 180;
const EARTH_R = [6731, 3958.8];
const LNG = 0;
const LAT = 1;

Helpers.METRIC = 0;
Helpers.IMPERIAL = 1;

Helpers.unitSystem = parseInt(localStorage.unitSystem) || Helpers.IMPERIAL;
Helpers.UTCOffset = parseInt(localStorage.UTCOffset) || 0;

Helpers.toggleUnitSystem = _ => {
  let system = (Helpers.unitSystem + 1) % 2;
  Helpers.unitSystem = system;
  localStorage.unitSystem = system;
};

Helpers.distLabel = _ => Helpers.unitSystem ? "mi." : "km.";
Helpers.speedLabel = _ => Helpers.unitSystem ? "mph" : "kph";

Helpers.flightStats = arr => arr.map(obj => {
  if(!obj.end) return obj;
  obj.dist = Helpers.getDistance(obj.start.coord, obj.end.coord);
  obj.speed = 3600 * obj.dist / obj.elapsed;
  return obj;
})


Helpers.getDistance = (c1, c2) => {
  if(c1 == undefined || c2 == undefined) return "";
  var φ1 = radians(c1[LAT])
  var φ2 = radians(c2[LAT])
  var Δφ = radians(c2[LAT]-c1[LAT])
  var Δλ = radians(c2[LNG]-c1[LNG])

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return c * EARTH_R[Helpers.unitSystem];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const pad = (n) => Math.floor(n).toString().padStart(2, 0);

Helpers.getMaxDate = x => DAYS[x-1];
Helpers.formatCoord = ({coord}, i) => coord === undefined || coord[i] == "" ? "" : coord[i].toFixed(3).toString().padStart(8, '\u00A0');
Helpers.formatTime = t => t === undefined ? "" : [t/86400, t/3600 % 24, t/60 % 60, t % 60].map(pad).join(":");
Helpers.formatDate = ({time}) => {
  if(time === undefined) return "";
  let d = new Date(time + 3600e3 * Helpers.UTCOffset);
  return <>
    {pad(d.getUTCDate())} {MONTHS[d.getUTCMonth()]}<br/>
    {[d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].map(pad).join(":")}
  </>
}

export default Helpers
