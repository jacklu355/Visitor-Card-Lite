// 自动创建 CSS 样式
const style = document.createElement('style');
style.textContent = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#visitor-card {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 240px;
    padding: 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Microsoft YaHei', sans-serif;
    color: #fff;
    z-index: 9999;
    background-size: cover;
    background-position: center;
    transition: left 0.5s ease;
}
#visitor-card.hidden {
    left: -200px;
}
#visitor-card .time {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 12px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
#visitor-card .visitor-item {
    display: flex;
    justify-content: space-between;
    margin: 6px 0;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
#visitor-card .label {
    opacity: 0.9;
}
#visitor-card .value {
    font-weight: 600;
}
.toggle-btn {
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 50px;
    border-radius: 0 8px 8px 0;
    background: transparent;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 9999;
    transition: text-shadow 0.3s;
}
.toggle-btn:hover {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}
`;
document.head.appendChild(style);

// 自动创建 HTML 结构
const cardHtml = `
    <button class="toggle-btn" id="toggleBtn">→</button>
    <div class="time" id="timeDisplay"></div>
    <div class="visitor-item">
        <span class="label">今日访客：</span>
        <span class="value" id="todayVisitor"></span>
    </div>
    <div class="visitor-item">
        <span class="label">总访客数：</span>
        <span class="value" id="totalVisitor"></span>
    </div>
`;
const card = document.createElement('div');
card.id = 'visitor-card';
card.innerHTML = cardHtml;
document.body.appendChild(card);

// 工具函数：获取北京时间
function getBeijingTime() {
    return new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
}

// 工具函数：获取 Bing 背景图
async function getBingBackground() {
    try {
        const res = await fetch('https://bing.biturl.top/?resolution=1920&format=json&mkt=zh-CN');
        const data = await res.json();
        return data.url;
    } catch (err) {
        return 'https://picsum.photos/1920/1080';
    }
}

// 工具函数：获取访客数据
function getVisitorData() {
    const today = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const stored = localStorage.getItem('visitor_stats');
    if (stored) {
        const data = JSON.parse(stored);
        return data.date !== today 
            ? { date: today, today: 1, total: data.total + 1 } 
            : { date: today, today: data.today + 1, total: data.total + 1 };
    }
    return { date: today, today: 1, total: 1 };
}

// 隐藏/展开逻辑
let isHidden = false;
const READ_TIME_THRESHOLD = 10;
const SCROLL_THRESHOLD = 500;
let readTime = 0;

function hideCard() {
    card.classList.add('hidden');
    document.getElementById('toggleBtn').textContent = '←';
    isHidden = true;
}

function showCard() {
    card.classList.remove('hidden');
    document.getElementById('toggleBtn').textContent = '→';
    isHidden = false;
}

// 自动隐藏定时器
const readTimer = setInterval(() => {
    if (!isHidden) readTime++;
    if (readTime >= READ_TIME_THRESHOLD) {
        hideCard();
        clearInterval(readTimer);
    }
}, 1000);

// 滚动监听自动隐藏
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (!isHidden && scrollTop >= SCROLL_THRESHOLD) {
        hideCard();
        clearInterval(readTimer);
    }
});

// 按钮点击事件
document.getElementById('toggleBtn').addEventListener('click', () => {
    isHidden ? showCard() : hideCard();
});

// 初始化卡片
async function initCard() {
    // 设置背景图
    const bgUrl = await getBingBackground();
    card.style.backgroundImage = `url(${bgUrl})`;
    // 更新时间
    document.getElementById('timeDisplay').textContent = getBeijingTime();
    setInterval(() => {
        document.getElementById('timeDisplay').textContent = getBeijingTime();
    }, 1000);
    // 更新访客数据
    const stats = getVisitorData();
    localStorage.setItem('visitor_stats', JSON.stringify(stats));
    document.getElementById('todayVisitor').textContent = stats.today;
    document.getElementById('totalVisitor').textContent = stats.total;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', initCard);
 } else {
     initCard();
}
