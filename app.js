let playerBalance = 1000;
let betAmount = 100;
let betType = '';
let history = [];

// 儲存帳戶數據與歷史紀錄
window.onload = function() {
  if (localStorage.getItem('balance')) {
    playerBalance = parseInt(localStorage.getItem('balance'));
    document.getElementById('playerBalance').textContent = playerBalance;
  }
  if (localStorage.getItem('history')) {
    history = JSON.parse(localStorage.getItem('history'));
    updateHistory();
  }
};

function placeBet(type) {
  betType = type;
  document.getElementById('result').textContent = `你下注了${betAmount}元在${betType === 'player' ? '閒家' : betType === 'banker' ? '莊家' : '和局'}`;
}

function deal() {
  if (!betType) {
    alert("請先下注！");
    return;
  }

  const playerCards = getCards();
  const bankerCards = getCards();

  document.getElementById('playerCards').textContent = `${playerCards[0]} ${playerCards[1]}`;
  document.getElementById('bankerCards').textContent = `${bankerCards[0]} ${bankerCards[1]}`;

  const playerPoints = calculatePoints(playerCards);
  const bankerPoints = calculatePoints(bankerCards);

  let result = '';
  if (playerPoints > bankerPoints) {
    result = '閒家勝';
    if (betType === 'player') {
      playerBalance += betAmount;
    } else {
      playerBalance -= betAmount;
    }
  } else if (bankerPoints > playerPoints) {
    result = '莊家勝';
    if (betType === 'banker') {
      playerBalance += betAmount * 0.95; // 5% 抽水
    } else {
      playerBalance -= betAmount;
    }
  } else {
    result = '和局';
    if (betType === 'tie') {
      playerBalance += betAmount * 8;
    } else {
      playerBalance -= betAmount;
    }
  }

  document.getElementById('result').textContent = result;
  document.getElementById('playerBalance').textContent = playerBalance;
  saveData();
  updateHistory(result, playerCards, bankerCards);
  betType = ''; // 重置下注
}

function getCards() {
  const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return [cards[Math.floor(Math.random() * 13)], cards[Math.floor(Math.random() * 13)]];
}

function calculatePoints(cards) {
  const cardValues = cards.map(card => {
    if (card === 'A') return 1;
    if (['J', 'Q', 'K'].includes(card)) return 0;
    return parseInt(card);
  });

  const sum = cardValues.reduce((acc, val) => acc + val, 0);
  return sum % 10;
}

function saveData() {
  localStorage.setItem('balance', playerBalance);
  localStorage.setItem('history', JSON.stringify(history));
}

function updateHistory(result, playerCards, bankerCards) {
  history.push({ result, playerCards, bankerCards });
  const historyList = document.getElementById('historyList');
  const listItem = document.createElement('li');
  listItem.textContent = `結果: ${result} | 閒家: ${playerCards.join(' ')} | 莊家: ${bankerCards.join(' ')}`;
  historyList.appendChild(listItem);
}
