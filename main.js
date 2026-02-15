// 只保留输入框元素（删除所有 result 结果元素）
const pickupInput = document.getElementById('pickup-input');
const hotelInput = document.getElementById('hotel-input');
const carInput = document.getElementById('car-input');
const guideInput = document.getElementById('guide-input');
const ticketInput = document.getElementById('ticket-input');
const mealInput = document.getElementById('meal-input');

const totalResult = document.getElementById('total-result');

// 计算器按键相关元素（保留）
const numKeys = document.querySelectorAll('.num-key[data-key]');
const opKeys = document.querySelectorAll('.op-key[data-key]');
const backspaceKey = document.getElementById('backspace-key');
const clearKey = document.getElementById('clear-key');
const confirmKey = document.getElementById('confirm-key');

// 全局变量：当前激活的输入框
let activeInput = pickupInput;

// 切换激活输入框逻辑（保留）
document.querySelectorAll('.input-row').forEach(row => {
    const input = row.querySelector('.formula-input');
    row.addEventListener('click', () => {
        [pickupInput, hotelInput, carInput, guideInput, ticketInput, mealInput].forEach(ele => {
            ele.style.borderColor = '#ddd';
        });
        input.style.borderColor = '#409eff';
        activeInput = input;
    });
});

// 按键输入逻辑（保留，仍触发总计计算）
function appendKeyToInput(key) {
    activeInput.value += key;
    calculateAll();
}

// 数字按键绑定（保留）
numKeys.forEach(btn => {
    btn.addEventListener('click', () => {
        appendKeyToInput(btn.dataset.key);
    });
});

// 运算符按键绑定（保留）
opKeys.forEach(btn => {
    if (btn.dataset.key) {
        btn.addEventListener('click', () => {
            appendKeyToInput(btn.dataset.key);
        });
    }
});

// 退格键（保留）
backspaceKey.addEventListener('click', () => {
    activeInput.value = activeInput.value.slice(0, -1);
    calculateAll();
});

// 清空键（保留）
clearKey.addEventListener('click', () => {
    activeInput.value = '';
    calculateAll();
});

// 确认键（保留视觉反馈）
confirmKey.addEventListener('click', () => {
    activeInput.style.borderColor = '#67c23a';
    calculateAll();
    setTimeout(() => {
        activeInput.style.borderColor = '#409eff';
    }, 500);
});

// 计算公式逻辑（保留）
function calculateFormula(formula) {
    if (!formula || formula.trim() === '') return 0;
    try {
        let cleanFormula = formula.replace(/\s+/g, '').replace(/×/g, '*');
        const validPattern = /^[\d\+\-\*\(\)\.]+$/;
        if (!validPattern.test(cleanFormula)) return 0;
        const calcFunc = new Function(`return ${cleanFormula}`);
        const result = calcFunc();
        return isNaN(result) || !isFinite(result) ? 0 : result;
    } catch (error) {
        return 0;
    }
}

// 计算总计（删除单行结果更新，只保留总计）
function calculateAll() {
    const pickupVal = calculateFormula(pickupInput.value);
    const hotelVal = calculateFormula(hotelInput.value);
    const carVal = calculateFormula(carInput.value);
    const guideVal = calculateFormula(guideInput.value);
    const ticketVal = calculateFormula(ticketInput.value);
    const mealVal = calculateFormula(mealInput.value);

    // 只更新总计
    const total = pickupVal + hotelVal + carVal + guideVal + ticketVal + mealVal;
    totalResult.textContent = total.toFixed(2);
}

// 回车键计算（保留）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculateAll();
});

// 初始化
pickupInput.style.borderColor = '#409eff';
calculateAll();