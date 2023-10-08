const gameBoard = document.getElementById('board');

let unitBase = [];

let unitCoords = [
    {x: 0, y: 0}, {x: 100, y: 0},{x: 200, y: 0},
    {x: 0, y: 300}, {x: 100, y: 300},{x: 200, y: 300},
];

function UnitObject(name='Bot', hp=10, damage=3, active=true) {
    this.name = name;
    this.hp = hp;
    this.damage = damage;
    this.active = active;
}

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

unitBase = createUnits();

const allUnits = document.querySelectorAll('.unit');
allUnits.forEach(unit => {
    unit.addEventListener('click', handleUnitClicker);
});

let unitFirst = null;
let unitSecond = null;
let turnCounter = 0;

function handleUnitClicker(event) {

    // const index = event.target.dataset.count;
    
    if (unitFirst === null && 
        unitSecond === null &&
        !event.target.classList.contains('inactive')) {

        unitFirst = event.target;
        unitFirst.classList.remove('active');
        unitFirst.classList.add('selected');
        // console.log(unitBase[index]);

    } else if (unitFirst !== null && 
        unitSecond === null && 
        unitFirst.classList[1] != event.target.classList[1]) {

        unitSecond = event.target;
        unitSecond.classList.remove('active');
        unitSecond.classList.add('selected');
        // console.log(unitBase[index]);

        battle(unitFirst, unitSecond);

        unitFirst = null;
        unitSecond = null;

    } else if (unitFirst == event.target &&
        !event.target.classList.contains('inactive')) {

        unitFirst.classList.remove('selected');
        unitFirst.classList.add('active');
        unitFirst = null;

    } else if (!event.target.classList.contains('inactive')) {

        unitFirst.classList.remove('selected');
        unitFirst.classList.add('active');
        unitFirst = event.target;
        unitFirst.classList.remove('active');
        unitFirst.classList.add('selected');

    }
}

function battle(u1, u2) {
    setTimeout( function() {
        calculateDamage(u1, u2);
        u1.classList.remove('selected');
        u1.classList.add('inactive');

        unitBase[u1.dataset.count].active = false;

        u2.classList.remove('selected');
        u2.classList.add('active');
    }, 500);
    
}


function calculateDamage(u1, u2) {
    const damage = unitBase[u1.dataset.count].damage;
    const hp = unitBase[u2.dataset.count].hp;
    const name = unitBase[u2.dataset.count].name;
    const currentHp = hp - damage;
    unitBase[u2.dataset.count].hp = currentHp;
    u2.innerHTML = `${name} ${currentHp}`;
}