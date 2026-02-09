// 算命页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化日期选择器
    initDateSelectors();
    
    // 初始化导航
    initNavigation();
    
    // 初始化表单
    initForms();
    
    // 初始化退出按钮
    initLogout();
});

// 初始化日期选择器
function initDateSelectors() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    
    if (!yearSelect || !monthSelect || !daySelect) return;
    
    // 填充年份选项 (1900-2026)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        yearSelect.appendChild(option);
    }
    
    // 月份变化时更新日期
    monthSelect.addEventListener('change', updateDayOptions);
    yearSelect.addEventListener('change', updateDayOptions);
    
    // 初始更新日期选项
    updateDayOptions();
}

// 更新日期选项
function updateDayOptions() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    
    if (!yearSelect || !monthSelect || !daySelect) return;
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    // 清空现有选项（保留第一个）
    while (daySelect.options.length > 1) {
        daySelect.remove(1);
    }
    
    // 如果年份和月份都有效
    if (year && month) {
        // 获取该月的天数
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 添加日期选项
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            daySelect.appendChild(option);
        }
    }
}

// 初始化导航
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.fortune-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 添加active类到当前链接
            this.classList.add('active');
            
            // 显示对应部分
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 滚动到对应部分
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 初始化表单
function initForms() {
    const destinyForm = document.getElementById('destinyForm');
    if (destinyForm) {
        destinyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const year = document.getElementById('birthYear').value;
            const month = document.getElementById('birthMonth').value;
            const day = document.getElementById('birthDay').value;
            const time = document.getElementById('birthTime').value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const question = document.getElementById('question').value;
            
            // 验证数据
            if (!year || !month || !day) {
                showMessage('请填写完整的出生日期', 'error');
                return;
            }
            
            // 显示加载状态
            showLoading();
            
            // 模拟API调用（实际应该发送到服务器）
            setTimeout(() => {
                hideLoading();
                generateFortuneResult(year, month, day, time, gender, question);
            }, 1500);
        });
    }
}

// 生成算命结果
function generateFortuneResult(year, month, day, time, gender, question) {
    // 这里应该是实际的算命逻辑
    // 现在用模拟数据
    
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const zodiacIndex = (year - 4) % 12;
    const zodiac = zodiacAnimals[zodiacIndex];
    
    const fortunes = [
        {
            title: '📅 近期运势',
            content: '未来三个月运势平稳上升，事业上有新的机会出现，感情方面需要主动沟通。'
        },
        {
            title: '💰 财运分析',
            content: '正财稳定，偏财运一般。建议保守投资，避免高风险项目。'
        },
        {
            title: '❤️ 感情运势',
            content: '单身者有机会遇到心仪对象，已婚者需多花时间陪伴家人。'
        },
        {
            title: '🏃 健康建议',
            content: '注意作息规律，适当运动，保持心情愉快。'
        }
    ];
    
    // 更新结果显示
    const resultTitle = document.querySelector('.result-title');
    const resultContent = document.querySelector('.result-content');
    
    if (resultTitle && resultContent) {
        resultTitle.innerHTML = `📜 ${zodiac}年${month}月${day}日出生 · ${gender === 'male' ? '男' : '女'}性`;
        
        let contentHTML = '';
        fortunes.forEach(fortune => {
            contentHTML += `
                <div class="result-item">
                    <h4>${fortune.title}</h4>
                    <p>${fortune.content}</p>
                </div>
            `;
        });
        
        if (question) {
            contentHTML += `
                <div class="result-item">
                    <h4>❓ 关于您的问题</h4>
                    <p>关于"${question}"，建议保持耐心，时机成熟时自然会有答案。</p>
                </div>
            `;
        }
        
        resultContent.innerHTML = contentHTML;
        
        // 滚动到结果部分
        const resultSection = document.querySelector('.destiny-right');
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        showMessage('占卜完成！请查看结果。', 'success');
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 显示动画
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 10);
    
    // 3秒后移除
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// 显示加载状态
function showLoading() {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-crystal-ball fa-spin"></i>
            <p>正在解读天机...</p>
        </div>
    `;
    
    loadingEl.id = 'loadingOverlay';
    document.body.appendChild(loadingEl);
}

// 隐藏加载状态
function hideLoading() {
    const loadingEl = document.getElementById('loadingOverlay');
    if (loadingEl && loadingEl.parentNode) {
        loadingEl.parentNode.removeChild(loadingEl);
    }
}

// 初始化退出按钮
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出玄机阁吗？')) {
                window.location.href = 'index.html';
            }
        });
    }
}

// 添加消息样式
const style = document.createElement('style');
style.textContent = `
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: rgba(26, 26, 46, 0.95);
        border-left: 4px solid #6a11cb;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
    }
    
    .message.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .message.success {
        border-left-color: #4CAF50;
    }
    
    .message.error {
        border-left-color: #f44336;
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .loading-spinner {
        text-align: center;
        color: white;
    }
    
    .loading-spinner i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #6a11cb;
    }
    
    .loading-spinner p {
        font-size: 1.2rem;
    }
    
    .fa-spin {
        animation: fa-spin 2s infinite linear;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);