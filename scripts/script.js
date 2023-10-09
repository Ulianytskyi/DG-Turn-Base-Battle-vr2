const gameBoard = document.getElementById('board');

let unitBase = [];

let unitCoords = [
    {x: 0, y: 0}, {x: 100, y: 0},{x: 200, y: 0},
    {x: 0, y: 300}, {x: 100, y: 300},{x: 200, y: 300},
];

function UnitObject(name='Bot', hp=75, damage=55, active=true) {
    this.name = name;
    this.hp = hp;
    this.damage = damage;
    this.active = active;
}

let hitChance = 80;

function createUnits() {
    let allUnitsArray = [];
    for (let i = 0; i < 6; i++) {
        let side = i < 3 ? 'hero' : 'enemy';
        const unitShell = document.createElement('div');
        const unitObject = new UnitObject(side);

        unitShell.className = `unit ${side} active`;
        unitShell.dataset.count = i;
        unitShell.innerHTML = `${unitObject.name} ${unitObject.hp}`;
        unitShell.style.top = unitCoords[i].x + 'px';
        unitShell.style.left = unitCoords[i].y + 'px';

        gameBoard.appendChild(unitShell);
        allUnitsArray.push(unitObject);
    }
    return allUnitsArray;
}

function getRandomNumber(value) {
    return Math.floor(Math.random() * value) + 1;
}

unitBase = createUnits();

const allUnits = document.querySelectorAll('.unit');
allUnits.forEach(unit => {
    unit.addEventListener('click', handleUnitClicker);
});

let unitFirst = null;
let unitSecond = null;
let noActivity = false;
let unitHeroAlive = 3;
let unitEnemyAlive = 3;

let randomSide = getRandomNumber(2) == 1 ? 'hero' : 'enemy';
let currentTurn = randomSide;

// turn side field -------------------------------------------

const turnInfoField = document.createElement('div');
turnInfoField.id = 'turn-info-field';
gameBoard.appendChild(turnInfoField);

function turnInfoPosition () {
    if (currentTurn == 'hero') {
        turnInfoField.style.left = 16 + 'px';
        turnInfoField.style.color = 'blue';
        turnInfoField.innerHTML = 'Hero turn';
    } else {
        turnInfoField.style.left = 310 + 'px';
        turnInfoField.style.color = 'red';
        turnInfoField.innerHTML = 'Enemy turn';
    }
}

turnInfoPosition ();

// console.log('firts turn:', currentTurn);

function handleUnitClicker(event) {
    
    if ((currentTurn == 'hero' && event.target.classList.contains('hero')) ||
        (currentTurn == 'enemy' && event.target.classList.contains('enemy'))) {
 
            if (unitFirst === null && 
            unitSecond === null &&
            !event.target.classList.contains('inactive') &&
            !event.target.classList.contains('dead')) {

                    unitFirst = event.target;
                    unitFirst.classList.remove('active');
                    unitFirst.classList.add('selected');

                    currentTurn = currentTurn === 'hero' ? 'enemy' : 'hero';
            } else if (unitFirst !== null && 
                unitSecond === null && 
                unitFirst.classList[1] != event.target.classList[1] &&
                !event.target.classList.contains('dead')) {

                    unitSecond = event.target;
                    unitSecond.classList.remove('active');
                    unitSecond.classList.add('selected');

                    battle(unitFirst, unitSecond);

                    unitFirst = null;
                    unitSecond = null;  
            } else if (unitFirst == event.target &&
                !event.target.classList.contains('inactive')) {

                    unitFirst.classList.remove('selected');
                    unitFirst.classList.add('active');
                    unitFirst = null;
            } else if (!event.target.classList.contains('inactive') &&
                !event.target.classList.contains('dead')) {

                    unitFirst.classList.remove('selected');
                    unitFirst.classList.add('active');
                    unitFirst = event.target;
                    unitFirst.classList.remove('active');
                    unitFirst.classList.add('selected');
            }
    }
}

function turnCheck() {
    if (document.querySelectorAll('.hero.active').length === 0 &&
    document.querySelectorAll('.hero.selected').length === 0) {
        // console.log('No hero who can fight');
        currentTurn = 'enemy';
    } else if (document.querySelectorAll('.enemy.active').length === 0 &&
    document.querySelectorAll('.enemy.selected').length === 0) {
        // console.log('No enemy who can fight');
        currentTurn = 'hero'; 
    }
    turnInfoPosition ();
}
    
function battle(u1, u2) {
    setTimeout( function() {
        calculateDamage(u1, u2);
        u1.classList.remove('selected');
        u1.classList.add('inactive');
        u2.classList.remove('selected');
        if (!u2.classList.contains('inactive') && !u2.classList.contains('dead')) {
            u2.classList.add('active');
        }
        checkNextPhase();
    }, 500);
    unitBase[u1.dataset.count].active = false;
}

function calculateDamage(u1, u2) {
    const attack = unitBase[u1.dataset.count].damage;
    const damage = cheatOn ? 100 : Math.floor((Math.random() * hitChance) / 100 * attack);
    const hp = unitBase[u2.dataset.count].hp;
    const name = unitBase[u2.dataset.count].name;
    let currentHp = hp - damage;
    if (currentHp <= 0) {currentHp = 0;}
    unitBase[u2.dataset.count].hp = currentHp;
    u2.innerHTML = `${name} ${currentHp}`;
    showDamage(damage, u2);
    checkDeath(u2);
}

function showDamage(damage, u2) {
    const damageField = document.createElement('div');
    damageField.className = 'damage-field';
    damageField.textContent = `-${damage}`;
    setTimeout(function() {
        damageField.textContent = '';
    }, 1000);
    u2.appendChild(damageField);
}

function checkNextPhase() {
    noActivity = checkActiveUnits() == 0 ? true : false;
    if (noActivity) {
        allUnits.forEach(unit => {
            if (!unit.classList.contains('dead')) {
                unitBase[unit.dataset.count].active = true;
                unit.classList.remove('inactive')
                unit.classList.add('active');
            }
        });
        noActivity = false;
        // currentTurn = randomSide;
    }
}

function checkDeath(u2) {
    if (unitBase[u2.dataset.count].hp == 0) {
        const unitType = u2.classList[1];
        if (unitType == 'hero') {
            unitHeroAlive--;
        } else {
            unitEnemyAlive--;
        }
        u2.className = `unit ${unitType} dead`;
    }
    turnCheck();
    gameOverPanel();
}

function checkActiveUnits() {
    return document.querySelectorAll('.active').length;
}

function gameOverPanel() {
    if (unitHeroAlive == 0) {
        winPose('Enemy wins!');
    } else if (unitEnemyAlive == 0) {
        winPose('Hero wins!');
    }
}

function winPose(text) {
    infoField.style.display = 'flex';
    infoField.innerHTML = text;
    allUnits.forEach(unit => {
        if (!unit.classList.contains('dead')) {
            unit.classList.add('winner');
        }
    });
}

// cheat button ----------------------------

const cheatButton = document.createElement('button');
cheatButton.textContent = 'One Punch Mode Off';
cheatButton.id = 'cheat-btn';
cheatButton.className = 'cheat-btn-off';
let cheatOn = false;
cheatButton.addEventListener('click', ()=> {
    if (!cheatOn) {
        cheatOn = true;
        cheatButton.className = 'cheat-btn-on';
        cheatButton.textContent = 'One Punch Mode On';
    } else {
        cheatOn = false;
        cheatButton.className = 'cheat-btn-off';
        cheatButton.textContent = 'One Punch Mode Off';
    }
})
document.body.appendChild(cheatButton);

// final information block -------------------------------------------

const infoField = document.createElement('div');
infoField.addEventListener('click', ()=> {
    location.reload();
});
infoField.id = 'info-field';
infoField.style.display = 'none';
infoField.innerHTML = 'Lorem Ipsum';
gameBoard.appendChild(infoField);
