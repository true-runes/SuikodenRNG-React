import AreaClass from './Area';
import { Areas } from './interfaces';
// import { IDs } from './constants';
// import { enemies } from './enemies';

export function numToHexString(num: number): string {
  return '0x' + `0000000${num.toString(16)}`.substr(-8);
}

export function mult32ulo(n: number, m: number): number {
  n >>>= 0;
  m >>>= 0;
  const nlo = n & 0xffff;
  const nhi = n - nlo;
  return (((nhi * m >>> 0) + (nlo * m)) & 0xFFFFFFFF) >>> 0;
}

export function mult32uhi(n: number, m: number): number {
  n >>>= 0;
  m >>>= 0;

  return ((n * m) - mult32ulo(n, m)) / Math.pow(2, 32);
}

export function div32ulo(n: number, m: number): number {
  return Math.floor(n / m) >>> 0;
}

export function initAreas(enemies: Areas): { [key: string]: AreaClass } {
  const areas = {};
  for (const area in enemies) {
    if (enemies.hasOwnProperty(area)) {
      areas[area] = new AreaClass(area, enemies[area]);
    }
  }
  return areas;
}

/*
export function fillAreaSelect(Areas: IAreas): void {
  const areaSelect = $(`#${IDs.AreaSelect}`);

  for (const area in Areas) {
    if (Areas[area].areaType !== null) {
      areaSelect.append($('<option>', {
        text: area,
        value: area
      }));
    }
  }
}

export function download(item, filename) {
  // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(item));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
*/

export const areaNames = [
  'Cave of the Past',
  'Dragon Knights Area',
  'Dragons Den',
  'Dwarves Trail',
  'Dwarves Vault',
  'Gradys Mansion',
  'Great Forest',
  'Gregminster Area 1',
  'Gregminster Area 2',
  'Gregminster Palace',
  'Kalekka',
  'Kalekka Area',
  'Kobold Village',
  'Krazes Mansion',
  'Lenankamp',
  'Lepants Mansion',
  'Lorimar Area',
  'Magicians Island',
  'Moravia Area',
  'Moravia Castle',
  'Mt Seifu',
  'Mt Tigerwolf',
  'Neclords Castle',
  'Panna Yakuta Area',
  'Panna Yakuta',
  'Rockland',
  'Scarleticia Area',
  'Scarleticia Castle',
  'Seek Valley',
  'Seika',
  'Seika Area',
  'Shasarazade Fortress',
  'Soniere Prison',
  'Toran Lake Castle'
];

// Params has to be a URLSearchParams object.
// There's a typescript bug where URLSearchParams.keys() does not exist
// So we use any to get it to compile :(
/* keys() doesn't seem to work so we're just commenting this thing out
export function paramsToObject(params: any): { [key: string]: string } {
  const paramsObject = {};
  console.log(params);
  for (const key of params.keys()) {
    paramsObject[key] = params.getAll(key);
  }
  return paramsObject;
}
*/
