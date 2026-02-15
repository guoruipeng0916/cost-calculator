// 获取页面元素（新增接机、酒店、餐的元素）
const pickupInput = document.getElementById('pickup-input');
const hotelInput = document.getElementById('hotel-input');
const carInput = document.getElementById('car-input');
const guideInput = document.getElementById('guide-input');
const ticketInput = document.getElementById('ticket-input');
const mealInput = document.getElementById('meal-input');

const pickupResult = document.getElementById('pickup-result');
const hotelResult = document.getElementById('hotel-result');
const carResult = document.getElementById('car-result');
const guideResult = document.getElementById('guide-result');
const ticketResult = document.getElementById('ticket-result');
const mealResult = document.getElementById('meal-result');

const calculateBtn = document.getElementById('calculate-btn');
const totalResult = document.getElementById('total-result');

// 计算器按键相关元素（原有）
const numKeys = document.querySelectorAll('.num-key[data-key]');
const opKeys = document.querySelectorAll('.op-key[data-key]');
const backspaceKey = document.getElementById('backspace-key');
const clearKey = document.getElementById('clear-key');
const confirmKey = document.getElementById('confirm-key');

// 全局变量：记录当前激活的输入框（默认选中新增的第一个：接机）
let activeInput = pickupInput;

// ========== 切换激活的输入框（新增3个输入框到数组） ==========
document.querySelectorAll('.input-row').forEach(row => {
    const input = row.querySelector('.formula-input');
    row.addEventListener('click', () => {
        // 重置所有输入框边框（包含新增的3个）
        [pickupInput, hotelInput, carInput, guideInput, ticketInput, mealInput].forEach(ele => {
            ele.style.borderColor = '#ddd';
        });
        // 高亮当前激活的输入框
        input.style.borderColor = '#409eff';
        // 记录当前激活的输入框
        activeInput = input;
    });
});

// ========== 按键输入逻辑（原有，仅新增实时计算） ==========
function appendKeyToInput(key) {
    activeInput.value += key;
    calculateAll(); // 输入后实时计算
}

// 数字按键绑定（原有）
numKeys.forEach(btn => {
    btn.addEventListener('click', () => {
        appendKeyToInput(btn.dataset.key);
    });
});

// 运算符按键绑定（原有）
opKeys.forEach(btn => {
    btn.addEventListener('click', () => {
        appendKeyToInput(btn.dataset.key);
    });
});

// 退格按键（原有，新增实时计算）
backspaceKey.addEventListener('click', () => {
    activeInput.value = activeInput.value.slice(0, -1);
    calculateAll();
});

// 清空按键（原有，新增实时计算）
clearKey.addEventListener('click', () => {
    activeInput.value = '';
    calculateAll();
});

// 确认按键（原有，新增实时计算）
confirmKey.addEventListener('click', () => {
    activeInput.style.borderColor = '#67c23a';
    calculateAll();
    setTimeout(() => {
        activeInput.style.borderColor = '#409eff';
    }, 500);
});

// ========== 计算逻辑（原有，新增3项计算） ==========
function calculateFormula(formula) {
    if (!formula || formula.trim() === '') return 0;

    try {
        let cleanFormula = formula.replace(/\s+/g, '').replace(/×/g, '*');
        const validPattern = /^[\d\+\-\*\(\)\.]+$/;
        if (!validPattern.test(cleanFormula)) {
            return 0;
        }
        const calcFunc = new Function(`return ${cleanFormula}`);
        const result = calcFunc();
        if (isNaN(result) || !isFinite(result)) {
            return 0;
        }
        return result;
    } catch (error) {
        return 0;
    }
}

function calculateAll() {
    // 计算每一项（新增接机、酒店、餐）
    const pickupVal = calculateFormula(pickupInput.value);
    const hotelVal = calculateFormula(hotelInput.value);
    const carVal = calculateFormula(carInput.value);
    const guideVal = calculateFormula(guideInput.value);
    const ticketVal = calculateFormula(ticketInput.value);
    const mealVal = calculateFormula(mealInput.value);

    // 更新单项结果（新增3项，保留2位小数）
    pickupResult.textContent = `结果：${pickupVal.toFixed(2)}`;
    hotelResult.textContent = `结果：${hotelVal.toFixed(2)}`;
    carResult.textContent = `结果：${carVal.toFixed(2)}`;
    guideResult.textContent = `结果：${guideVal.toFixed(2)}`;
    ticketResult.textContent = `结果：${ticketVal.toFixed(2)}`;
    mealResult.textContent = `结果：${mealVal.toFixed(2)}`;

    // 计算总计（加入新增3项）
    const total = pickupVal + hotelVal + carVal + guideVal + ticketVal + mealVal;
    totalResult.textContent = total.toFixed(2);
}

// 绑定计算按钮（原有）
calculateBtn.addEventListener('click', calculateAll);

// 回车键计算（原有）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        calculateAll();
    }
});

// 初始化（默认激活接机输入框）
pickupInput.style.borderColor = '#409eff';
calculateAll();