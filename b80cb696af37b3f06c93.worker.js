/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/github.io/SuikodenRNG-React/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function findRNG(area, encounters, rng_val, progress) {
  // area; { dungeon: boolean, encounterRate: number, tableLength: number }
  let status = {
    message: '',
    progress: 0,
    done: false,
  };
  const startTime = new Date().getTime();
  if (encounters.length <= 1) { return null; }
    // Smaller array size is slower but more space efficient. Performance drop should be negligable.
  const arraySize = 0xffff;
  const fights = new Array(arraySize);
  const fightsRNG = new Array(arraySize);
  let rng = { rng: rng_val, rng2: rng_val >> 16 & 0x7FFF };
  function isBattle(rng) {
    return area.dungeon ? isBattleDungeon(rng, area.encounterRate) : isBattleWorldMap(rng, area.encounterRate);
  }
  for (let i = 0, index = 0; i < 0xffffffff; i++) {
    if (isBattle(rng.rng2)) {
      fights[index] = getEncounterIndex(nextrng(rng.rng), area.tableLength);
      fightsRNG[index] = rng;
      index++;
      if (index === arraySize - 1) {
        status.message = `Checking group of ${arraySize} fights`;
        progress ? progress(status) : console.log(status);
        const result = bayerMoore(fights, encounters, area.tableLength);
        if (result !== null) {
          status.done = true;
          status.result = fightsRNG[result];
          status.message = `Runtime: ${(new Date().getTime() - startTime) / 1000} seconds.`;
          progress ? progress(status) : console.log(status);
          return fightsRNG[result];
        }

        // Takes end of fights and puts it in the beginning for next iteration
        // Number of fight taken is length of pattern.
        for (let j = arraySize - encounters.length, k = 0; j < encounters.length; j++, k++) {
          fights[k] = fights[j];
          fightsRNG[k] = fights[j];
        }
        index = encounters.length;
        status.message = 'Generating fights to search';
        progress ? progress(status) : console.log(status);
      }
    }
    rng = nextrng(rng.rng);
    if (i % 42949672 === 0) {
      status.message = 'Generating fights to search';
      status.progress = i / 42949672;
      progress ? progress(status) : console.log(status);
    }
  }
  if(progress) progress({ progress: 100, message: 'No match found.', done: true });
  return null;
}

function bayerMoore(input, pattern, max) {
  // Create bad char array
  const badChar = new Array(max).fill(-1);
  for (let j = 0; j < pattern.length - 1; j++) {
    badChar[pattern[j]] = j;
  }

  // var pttrnIndx = pattern.length - 1;
  let i = pattern.length - 1;
  while (i < input.length) {
    // check if match
    let inputIndx = i;
    let pttrnIndx = pattern.length - 1;
    while (input[inputIndx] === pattern[pttrnIndx]) {
      inputIndx--;
      pttrnIndx--;
      if (pttrnIndx === -1) {
        return i - pattern.length + 1;
      }
    }
    const badCharVal = badChar[input[inputIndx]];
    // console.log('badCharVal:', badCharVal);
    const jump = badCharVal === -1 ? pattern.length - 1 : pattern.length - badCharVal - 1;
    i += jump;
  }
  return null;
}

function isBattleWorldMap(r2, encounterRate) {
  const r3 = r2;
  r2 = r2 >> 8 << 8;
  r2 = r3 - r2;
  return r2 < encounterRate;
}

function isBattleDungeon(r2, encounterRate) {
  const r3 = 0x7F;
  const mflo = div32ulo(r2, r3);
  r2 = mflo;
  r2 = r2 & 0xFF;
  return r2 < encounterRate;
}

function getEncounterIndex(rng, len) {
  const r2 = rng.rng2;
  const r3 = div32ulo(0x7FFF, len);
  let encounterIndex = div32ulo(r2, r3);
  while (encounterIndex >= len) {
    encounterIndex--;
  }
  return encounterIndex;
}

function nextrng(rng) {
  rng = mult32ulo(rng, 0x41c64e6d) + 0x3039;
  const rng2 = rng >> 16 & 0x7FFF;
  return { rng, rng2 };
}

function mult32ulo(n, m) {
  n >>>= 0;
  m >>>= 0;
  const nlo = n & 0xffff;
  const nhi = n - nlo;
  return (((nhi * m >>> 0) + (nlo * m)) & 0xFFFFFFFF) >>> 0;
}

function div32ulo(n, m) {
  return Math.floor(n / m) >>> 0;
}

onmessage = function(e) {
  const params = e.data;
  findRNG(params.area, params.encounters, params.rng, (status) => {
    postMessage(status);
  });
}
// findRNG({ dungeon: true, encounterRate: 2, tableLength: 11 }, [0, 0], 0x12);


/***/ })
/******/ ]);
//# sourceMappingURL=b80cb696af37b3f06c93.worker.js.map