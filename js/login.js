// 登录页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const digitBoxes = document.querySelectorAll('.digit-box');
    const numberButtons = document.querySelectorAll('.number-btn');
    const clearButton = document.querySelector('.clear-btn');
    const submitButton = document.querySelector('.submit-btn');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    let password = '';
    const CORRECT_PASSWORD = '6666';
    let isPasswordVisible = false;
    
    // 切换密码可见性
    togglePasswordBtn.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? 'text' : 'password';
        togglePasswordBtn.innerHTML = isPasswordVisible ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    });
    
    // 数字按钮点击事件
    numberButtons.forEach(button => {
        if (button.classList.contains('number-btn') && 
            !button.classList.contains('clear-btn') && 
            !button.classList.contains('submit-btn')) {
            
            button.addEventListener('click', function() {
                if (password.length < 4) {
                    const number = this.getAttribute('data-number');
                    password += number;
                    updatePasswordDisplay();
                }
            });
        }
    });
    
    // 清除按钮
    clearButton.addEventListener('click', function() {
        password = '';
        updatePasswordDisplay();
        playSound('clear');
    });
    
    // 提交按钮
    submitButton.addEventListener('click', function() {
        if (password.length === 4) {
            checkPassword();
        }
    });
    
    // 表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkPassword();
    });
    
    // 键盘输入支持
    passwordInput.addEventListener('input', function(e) {
        // 只允许数字
        this.value = this.value.replace(/\D/g, '');
        
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4);
        }
        
        password = this.value;
        updatePasswordDisplay();
    });
    
    // 键盘事件支持
    document.addEventListener('keydown', function(e) {
        // 数字键
        if (e.key >= '0' && e.key <= '9' && password.length < 4) {
            password += e.key;
            updatePasswordDisplay();
            playSound('click');
        }
        
        // 退格键
        if (e.key === 'Backspace') {
            password = password.slice(0, -1);
            updatePasswordDisplay();
            playSound('clear');
        }
        
        // 回车键
        if (e.key === 'Enter' && password.length === 4) {
            checkPassword();
        }
    });
    
    // 更新密码显示
    function updatePasswordDisplay() {
        // 更新输入框
        passwordInput.value = password;
        
        // 更新数字显示框
        digitBoxes.forEach((box, index) => {
            if (index < password.length) {
                box.textContent = password[index];
                box.classList.add('filled');
            } else {
                box.textContent = '•';
                box.classList.remove('filled');
            }
        });
        
        // 播放声音
        if (password.length > 0) {
            playSound('click');
        }
    }
    
    // 检查密码
    function checkPassword() {
        if (password === CORRECT_PASSWORD) {
            // 密码正确
            playSound('success');
            showSuccessAnimation();
            
            // 延迟跳转，让动画完成
            setTimeout(() => {
                window.location.href = 'fortune.html';
            }, 1500);
        } else {
            // 密码错误
            playSound('error');
            showError('密码错误！请重新输入。');
            
            // 清空密码
            password = '';
            updatePasswordDisplay();
            
            // 添加抖动效果
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
        }
    }
    
    // 显示错误消息
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
    
    // 显示成功动画
    function showSuccessAnimation() {
        // 禁用表单
        loginForm.classList.add('disabled');
        
        // 添加成功效果
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>密码正确！</h3>
                <p>正在进入玄机阁...</p>
                <div class="loading-spinner"></div>
            </div>
        `;
        
        document.querySelector('.login-container').appendChild(successOverlay);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .success-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.5s ease;
            }
            
            .success-content {
                text-align: center;
                animation: fadeInUp 0.5s ease 0.2s both;
            }
            
            .success-content i {
                font-size: 4rem;
                color: #4CAF50;
                margin-bottom: 1rem;
                animation: scaleIn 0.5s ease 0.4s both;
            }
            
            .success-content h3 {
                font-size: 2rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
            
            .success-content p {
                color: #aaa;
                margin-bottom: 2rem;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(76, 175, 80, 0.3);
                border-top-color: #4CAF50;
                border-radius: 50%;
                margin: 0 auto;
                animation: spin 1s linear infinite;
            }
            
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                }
                to {
                    transform: scale(1);
                }
            }
            
            .disabled {
                pointer-events: none;
                opacity: 0.5;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 播放声音
    function playSound(type) {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        let frequency = 440;
        let duration = 0.1;
        
        switch(type) {
            case 'click':
                frequency = 523.25; // C5
                duration = 0.1;
                break;
            case 'clear':
                frequency = 392.00; // G4
                duration = 0.15;
                break;
            case 'success':
                frequency = 659.25; // E5
                duration = 0.3;
                break;
            case 'error':
                frequency = 293.66; // D4
                duration = 0.2;
                break;
        }
        
        // 创建振荡器
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        // 音量包络
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    // 初始化
    updatePasswordDisplay();
    
    // 添加一些初始动画
    setTimeout(() => {
        document.querySelectorAll('.element').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('animate');
        });
    }, 1000);
    
    // 添加动画样式
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .element.animate {
            animation: float 3s ease-in-out infinite;
        }
        
        .shake {
            animation: shake 0.5s ease;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(animationStyle);
});