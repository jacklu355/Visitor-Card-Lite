// 新增：猜硬币小游戏组件
const coinGame = document.createElement('div');
coinGame.style.cssText = `
    position: fixed;
    bottom: 150px;
    left: 20px;
    width: 120px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-family: 'Microsoft YaHei', sans-serif;
    color: #fff;
    z-index: 9998;
    text-align: center;
`;
coinGame.innerHTML = `
    <div style="font-size:14px; margin-bottom:8px;">猜硬币</div>
    <div id="coin" style="width:60px; height:60px; margin:0 auto 8px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; color:#333; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2);">?</div>
    <div style="display:flex; gap:8px; justify-content:center;">
        <button id="guessHead" style="padding:4px 8px; border:none; border-radius:4px; background:rgba(255,255,255,0.3); color:#fff; cursor:pointer;">正面</button>
        <button id="guessTail" style="padding:4px 8px; border:none; border-radius:4px; background:rgba(255,255,255,0.3); color:#fff; cursor:pointer;">反面</button>
    </div>
    <div id="gameResult" style="margin-top:8px; font-size:12px;"></div>
`;
document.body.appendChild(coinGame);

// 硬币游戏逻辑
let coinResult = '';
const coinEl = document.getElementById('coin');
const resultEl = document.getElementById('gameResult');

// 抛硬币动画
function flipCoin() {
    coinEl.textContent = '?';
    resultEl.textContent = '';
    let flipCount = 0;
    const flipInterval = setInterval(() => {
        coinEl.textContent = flipCount % 2 === 0 ? '正' : '反';
        flipCount++;
        if (flipCount > 10) {
            clearInterval(flipInterval);
            coinResult = Math.random() > 0.5 ? '正' : '反';
            coinEl.textContent = coinResult;
        }
    }, 80);
}

// 初始化点击硬币触发抛币
coinEl.addEventListener('click', flipCoin);

// 猜正反逻辑
document.getElementById('guessHead').addEventListener('click', () => {
    if (!coinResult) {
        resultEl.textContent = '先点击硬币抛币！';
        return;
    }
    resultEl.textContent = coinResult === '正' ? '猜对啦！' : '猜错了~';
    coinResult = '';
});

document.getElementById('guessTail').addEventListener('click', () => {
    if (!coinResult) {
        resultEl.textContent = '先点击硬币抛币！';
        return;
    }
    resultEl.textContent = coinResult === '反' ? '猜对啦！' : '猜错了~';
    coinResult = '';
});
