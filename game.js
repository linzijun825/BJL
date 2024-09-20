let playerBalance = 1000; // 玩家初始金額
const MIN_BET = 1; // 最小下注金額
let gameHistory = []; // 保存遊戲歷史

// 更新顯示玩家餘額
function updateBalance() {
    document.getElementById('balance').textContent = `玩家餘額: $${playerBalance}`;
}

// 顯示歷史紀錄
function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '遊戲歷史：<br>' + gameHistory.join('<br>');
}

// 重置遊戲
function resetGame() {
    document.getElementById('result').textContent = '請選擇下注';
    document.getElementById('cards').innerHTML = '';
}

// 處理下注邏輯
function placeBet(betType) {
    const betAmount = parseInt(document.getElementById('betAmount').value);

    if (!betAmount || betAmount < MIN_BET) {
        document.getElementById('result').textContent = '請輸入有效的下注金額！';
        return;
    }

    if (betAmount > playerBalance) {
        document.getElementById('result').textContent = '餘額不足，請重新輸入下注金額！';
        return;
    }

    const playerPoints = calculatePoints();
    const bankerPoints = calculatePoints();
    let result = '';

    // 顯示撲克牌翻牌動畫
    showCards(playerPoints, bankerPoints);

    // 計算遊戲結果
    if (playerPoints > bankerPoints) {
        result = '閒家贏了！';
    } else if (bankerPoints > playerPoints) {
        result = '莊家贏了！';
    } else {
        result = '和局！';
    }

    // 賠率計算
    let winnings = 0;
    if (result === '閒家贏了！' && betType === 'player') {
        winnings = betAmount;
        playerBalance += winnings;
    } else if (result === '莊家贏了！' && betType === 'banker') {
        winnings = betAmount * 0.95; // 莊家贏，扣5%抽水
        playerBalance += winnings;
    } else if (result === '和局！' && betType === 'tie') {
        winnings = betAmount * 8;
        playerBalance += winnings;
    } else {
        playerBalance -= betAmount;
    }

    // 更新結果顯示
    const resultMessage = winnings > 0 
        ? `${result} 你贏了 $${winnings.toFixed(2)}！` 
        : `${result} 你輸了 $${betAmount}`;
    document.getElementById('result').textContent = resultMessage;

    // 保存遊戲歷史
    gameHistory.push(`下注: ${betType}, 結果: ${result}, 餘額變動: $${playerBalance}`);
    updateHistory();

    // 更新顯示餘額
    updateBalance();

    // 若玩家餘額為 0，遊戲結束
    if (playerBalance <= 0) {
        document.getElementById('result').textContent += ' 你已經破產了，遊戲結束！';
        disableButtons();
    }
}

// 顯示撲克牌翻牌動畫
function showCards(playerPoints, bankerPoints) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = `
        <div class="card" id="playerCard"><div class="front">${playerPoints}</div><div class="back"></div></div>
        <div class="card" id="bankerCard"><div class="front">${bankerPoints}</div><div class="back"></div></div>
    `;

    setTimeout(() => {
        document.getElementById('playerCard').classList.add('flipped');
        document.getElementById('bankerCard').classList.add('flipped');
    }, 500); // 延遲 500 毫秒後翻牌
}

// 隨機生成一副牌的點數，1-9 的點數保持不變，10, J, Q, K 都算作 0 點
function calculatePoints() {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let card1 = cards[Math.floor(Math.random() * cards.length)];
    let card2 = cards[Math.floor(Math.random() * cards.length)];
    let total = (card1 + card2) % 10;
    return total;
}
