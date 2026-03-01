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

// ========== 新增：定义存储/读取本地数据的方法 ==========
// 保存输入框数据到localStorage
function saveInputData() {
    const inputData = {
        pickup: pickupInput.value,
        hotel: hotelInput.value,
        car: carInput.value,
        guide: guideInput.value,
        ticket: ticketInput.value,
        meal: mealInput.value
    };
    localStorage.setItem('costCalculatorData', JSON.stringify(inputData));
}

// 从localStorage读取并恢复输入框数据
function loadInputData() {
    const savedData = localStorage.getItem('costCalculatorData');
    if (savedData) {
        try {
            const inputData = JSON.parse(savedData);
            pickupInput.value = inputData.pickup || '';
            hotelInput.value = inputData.hotel || '';
            carInput.value = inputData.car || '';
            guideInput.value = inputData.guide || '';
            ticketInput.value = inputData.ticket || '';
            mealInput.value = inputData.meal || '';
        } catch (e) {
            console.error('读取存储数据失败', e);
        }
    }
}

// ========== 原有逻辑：切换激活输入框 ==========
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

// ========== 改造：按键输入后保存数据 ==========
function appendKeyToInput(key) {
    activeInput.value += key;
    saveInputData(); // 新增：输入后立即保存
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

// ========== 改造：退格/清空后保存数据 ==========
backspaceKey.addEventListener('click', () => {
    activeInput.value = activeInput.value.slice(0, -1);
    saveInputData(); // 新增：退格后保存
    calculateAll();
});

clearKey.addEventListener('click', () => {
    activeInput.value = '';
    saveInputData(); // 新增：清空后保存
    calculateAll();
});

// 确认键（保留视觉反馈）
confirmKey.addEventListener('click', () => {
    activeInput.style.borderColor = '#67c23a';
    saveInputData(); // 新增：确认后保存（可选，防止手动修改输入框内容未保存）
    calculateAll();
    setTimeout(() => {
        activeInput.style.borderColor = '#409eff';
    }, 500);
});

// ========== 新增：监听输入框手动修改（可选，防止用户直接编辑输入框内容未保存） ==========
[pickupInput, hotelInput, carInput, guideInput, ticketInput, mealInput].forEach(input => {
    input.addEventListener('input', () => {
        saveInputData();
        calculateAll();
    });
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
    if (e.key === 'Enter') {
        saveInputData(); // 新增：回车后保存
        calculateAll();
    }
});

// ========== 初始化：先加载数据，再计算总计 ==========
loadInputData(); // 新增：页面加载时恢复数据
pickupInput.style.borderColor = '#409eff';
calculateAll();

// ========== 新增：页面关闭/刷新前强制保存（兜底） ==========
window.addEventListener('beforeunload', () => {
    saveInputData();
});