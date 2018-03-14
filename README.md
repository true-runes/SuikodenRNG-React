## Suikoden RNG Generator
This is a RNG calculator for the PS1 game Suikoden. It can predict RNG based
events, such as future encounters, enemy drops, and finding your RNG Seed.

## Known Mechanics
This is all pseudocode. There is actual code in the repo.

#### RNG call
The RNG value is a 32bit unsigned integer. It advances via the formula below.
It advances under these conditions. There might be more but these are off the
top of my head.
  1. Every step on World Map (Not in grace period).
  2. Every step in Dungeon (Not in grace period).
  3. Every frame in an area with moving NPCs.
    * My current theory is that advance 1-2 times per moving NPC in the area.
      Once to decide if the npc moves, and if it does it advances a
      2nd time to decide where to move. This hasn't been tested though and
      wouldn't factor in when NPCs move multiple steps since they can only move
      1 step per 4 frames. I'm assuming that it's 1 step per 4 frames since
      that's the speed you move at.
    * This advancement is applied when areas are loading as well. Which is why
      (not) skipping the town text (Textbox with townname that appears when you enter
      a town) is important for RNG manipulation.
    * Also advances during certain menus
      1. Viki's Teleportation menu
      2. Sanchez/Mathiu's Party Menus
  4. Every frame during Chinchironin (#FuckTaiHo)
    * Current assumption is once per frame. Not tested at all though.
  5. During War Battles
    * RNG Advanced depends on action. Each action advances RNG by a different
      amount. That amount always seems to be at least several hundred though.
    * Ninjas don't seem to advance RNG at all
  6. During duels
    * Seems to advance by small amount every turn. Likely just used to determine
      Kwanda's/Teo's action
  7. During regular battles
    * By far the most complex. Different actions advance RNG different amounts
    * RNG is advanced after the battles ends (last action completed) twice.
      1. To calculate item drop (Explained in later section)
      2. To calculate stat growths. RNG is advanced 7 times (Once per each stat)
         per level up per character.
  8. Marco's Cup Game. Is usually advanced by 70-90(Game version dependent?)

###### RNG Call Method
```javascript
// Since PS1 is a 32 bit system multiplication and division
// sets registers mflo and mhi with the results
// The & 0xFFFFFFFF simulates that
// In some languages proper multiplication without loss of precision
// requires custom implementation
rng = ((rng * 0x41c64e6d) & 0xFFFFFFFF) + 0x3039;
// This register is used in quite a few RNG based subroutines
// and is calculated in the RNG call
r2 = (rng >> 16) & 0x7FFF;
```

#### Run Success
Each battle has the same change of a run being successful or not successful
(Assuming the battle is escapable of course.) You have a 49% chance of
successfully running from a battle.

###### Run Method
```javascript
// On run attempt RNG call is made
// r2 is set in RNG call
if (r2 % 100 > 50)
  return true;
return false;
```

#### Is Battle Call
Called every step in Dungeons & World Map when not in grace period. This is the
reason RNG advances every step in these areas. World Map and Dungeons use
different methods. Note that World Map always has an encounter rate of 8 while
Dungeons can have encounter rates of 2 or 3.
 * Some Dungeon's can have multiple encounter rates. Known example is Mt.
   Tigerwolf where encounter rate is 2 or 3 depending on what screen you're on.

###### isBattle(World Map) Method
```javascript
// r2 is set in RNG call
r2 = r2 - (r2 & 0xFFFFFF00);
if (r2 < 8)
  return true;
return false;
```

###### isBattle(Dungeon) Method
```javascript
// r2 is set in RNG call
r3 = 0x7F;
// Division works like multiplication in that it uses mflo and mhi registers
// mflo = quotient
// mhi = remainder
// The below won't need the Math.floor if language doesn't autoconvert integers
// when doing integer division
r2 = Math.floor(r2/r3) & 0xFF;
r3 = getAreaEncounterRate(); // 2 or 3
if (r2 < r3)
  return true;
return false;
```
#### determineEncounter
Once the game decides you're getting into a battle, it still has to figure out
what enemy group you'll get. This is the method it uses. Note that it also
advances the RNG once, so for each battle you get you advance RNG at least twice
(once to check if you got into a battle and once to see what enemy group you're
fighting.)

###### determineEncounter Method
```javascript
// Once the game determines that you are getting a battle
// It calls RNG again
// r2 is set from RNG call

// The game references the encounter table for this function
// The encounter table is essentially an array of possible groups of enemies
// for every area with random battles
// it starts at 1 with the first battle
r3 = div32ulo(0x7FFF, this.encounterTable.length);
encounterIndex = div32ulo(r2, r3);
while (encounterIndex >= this.encounterTable.length) {
  encounterIndex--;
}
// If you're looking at the game's encounter table add 1 to this.
// The game index's from 1 here while this app index from 0
return encounterIndex;
```

#### Champion's Rune
The way Champion's Rune works is
  1. If getting into a battle
  2. determineEncounter
  3. If Champion's Rune equipped and below requirement met don't get into battle

```javascript
r17 = Math.floor(((sumOfEnemyLevels << 4) - sumOfEnemyLevels) / 0xa);
r16 = sumOfPartyLevels;
if (r16 < r17)
  return true;
return false;
```

#### Calculating Drop
The way the game calculates drops is pretty straightforward. Each enemy in the
game has 3 drop slots. It first uses RNG to determine which drop slot you're
rolling for. And if that slot is not empty it uses RNG to determine to decide if
the enemy drops that item. It does this until you get a drop or you go through
all the enemies in the group. It goes through the enemies in the order they're
shown in the battle menu (top to bottom.)

###### Calculate Drop Method
```
// Copied straight from app codebase since I'm lazy
for (enemy in enemyGroup) {
    let r2 = rng.getNext().rng2;
    const dropIndex = r2 % 3;
    if (dropIndex < enemy.drops.length) {
      const dropRate = enemy.drops[dropIndex].rate;
      r2 = rng.getNext(2).rng2;
      if (r2 % 100 < dropRate) {
        return enemy.drops[dropIndex].item;
      }
    }
}
return '';
```

## Other Sources
[Suikosource: All things Suikoden](http://www.suikosource.com/)

[Google Sheet with useful technical data and links](https://docs.google.com/spreadsheets/d/1W8mEcTqByBVljRmb6CSyWFFkM-l3QIoeBds1c2qjGWs/edit?usp=sharing)

[Google Doc Sheet with explanation of how the game uses RNG](https://docs.google.com/document/d/1ORCe1okh8RIpOGH8WegaFMKsi_aFC3QN5OZ96w3019Y/edit?usp=sharing)

