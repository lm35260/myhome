class ScratchCard {
    constructor() {
        this.canvas = document.getElementById('scratchCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.prizeText = document.getElementById('prizeText');
        this.prizeDisplay = document.getElementById('prizeDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.isScratching = false;
        this.scratchedPixels = 0;
        this.totalPixels = this.canvas.width * this.canvas.height;
        this.currentPrize = null;
        this.isRevealed = false;
        
        this.init();
        this.bindEvents();
        this.loadNewPrize();
    }
    
    init() {
        // 设置canvas样式
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'source-over';
        
        this.drawScratchLayer();
    }
    
    drawScratchLayer() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 创建银色渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#E8E8E8');
        gradient.addColorStop(0.3, '#C0C0C0');
        gradient.addColorStop(0.7, '#A8A8A8');
        gradient.addColorStop(1, '#888888');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加纹理效果
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.canvas.width; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i < this.canvas.height; i += 15) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // 添加"刮开有奖"文字
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        this.ctx.font = 'bold 24px Microsoft YaHei';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('刮开有奖', this.canvas.width / 2, this.canvas.height / 2);
        
        // 添加一些装饰图案
        this.drawDecorations();
        
        // 重置刮开状态
        this.scratchedPixels = 0;
        this.isRevealed = false;
        this.updateProgress();
    }
    
    drawDecorations() {
        // 绘制装饰星星
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        this.drawStar(60, 60, 12);
        this.drawStar(this.canvas.width - 60, 60, 10);
        this.drawStar(60, this.canvas.height - 60, 8);
        this.drawStar(this.canvas.width - 60, this.canvas.height - 60, 11);
        
        // 绘制装饰圆点
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 3 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawStar(centerX, centerY, radius) {
        const points = [];
        const angle = -Math.PI / 2;
        
        for (let i = 0; i < 10; i++) {
            const r = (i % 2 === 0) ? radius : radius * 0.4;
            const currentAngle = angle + (i * Math.PI / 5);
            points.push({
                x: centerX + r * Math.cos(currentAngle),
                y: centerY + r * Math.sin(currentAngle)
            });
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startScratching(e));
        this.canvas.addEventListener('mousemove', (e) => this.scratch(e));
        this.canvas.addEventListener('mouseup', () => this.stopScratching());
        this.canvas.addEventListener('mouseleave', () => this.stopScratching());
        
        // 触摸事件（移动端支持）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        // 按钮事件
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('revealBtn').addEventListener('click', () => this.reveal());
    }
    
    startScratching(e) {
        this.isScratching = true;
        this.scratch(e);
    }
    
    scratch(e) {
        if (!this.isScratching || this.isRevealed) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 设置擦除模式（减小半径以便更精细控制）
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 计算刮开进度
        this.calculateProgress();
    }
    
    stopScratching() {
        this.isScratching = false;
    }
    
    calculateProgress() {
        // 获取画布图像数据
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        let transparentPixels = 0;
        
        // 计算透明像素数量
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }
        
        const progress = (transparentPixels / this.totalPixels) * 100;
        this.updateProgress(progress);
        this.updateScratchHints(progress);
        
        // 如果刮开面积超过50%，显示完整奖品（提高阈值以便看到渐进效果）
        if (progress > 50 && !this.isRevealed) {
            this.reveal();
        }
    }
    
    updateScratchHints(progress) {
        // 根据刮开进度显示不同的提示文字
        let hintText = '';
        let showPrizeHint = false;
        
        if (progress < 5) {
            hintText = '继续刮开...';
        } else if (progress < 15) {
            hintText = '有奖品出现了！';
            showPrizeHint = true;
        } else if (progress < 25) {
            hintText = '快要揭晓了...';
            showPrizeHint = true;
        } else if (progress < 30) {
            hintText = '即将揭晓大奖！';
            showPrizeHint = true;
        }
        
        // 显示提示文字
        if (hintText && !this.isRevealed) {
            this.showScratchHint(hintText);
        }
        
        // 逐渐显示奖品信息
        if (showPrizeHint && this.currentPrize && !this.isRevealed) {
            this.showPartialPrize(progress);
        }
    }
    
    showScratchHint(text) {
        // 移除之前的提示
        const existingHint = document.querySelector('.scratch-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        // 创建新的提示元素
        const hint = document.createElement('div');
        hint.className = 'scratch-hint';
        hint.textContent = text;
        hint.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 215, 0, 0.9);
            color: #8B4513;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: hintPulse 1s ease-in-out;
            pointer-events: none;
        `;
        
        // 添加到刮刮卡容器
        const wrapper = document.querySelector('.scratch-card-wrapper');
        wrapper.appendChild(hint);
        
        // 2秒后自动移除
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 2000);
    }
    
    showPartialPrize(progress) {
        // 根据进度逐渐显示奖品信息
        let partialText = '';
        const prizeText = this.currentPrize.prize;
        
        if (progress >= 15 && progress < 20) {
            // 显示奖品类型的第一个字符
            partialText = prizeText.substring(0, 2) + '...';
        } else if (progress >= 20 && progress < 25) {
            // 显示更多字符
            const halfLength = Math.floor(prizeText.length / 2);
            partialText = prizeText.substring(0, halfLength) + '...';
        } else if (progress >= 25 && progress < 30) {
            // 显示大部分内容
            const mostLength = Math.floor(prizeText.length * 0.8);
            partialText = prizeText.substring(0, mostLength) + '...';
        }
        
        if (partialText) {
            this.showPrizePreview(partialText);
        }
    }
    
    showPrizePreview(text) {
        // 移除之前的预览
        const existingPreview = document.querySelector('.prize-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // 创建奖品预览元素
        const preview = document.createElement('div');
        preview.className = 'prize-preview';
        preview.textContent = text;
        preview.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, ${this.currentPrize.color}, #FFF);
            color: #8B4513;
            padding: 10px 20px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 3px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: prizeGlow 2s ease-in-out infinite;
            pointer-events: none;
            border: 2px solid #FFD700;
        `;
        
        // 添加到刮刮卡容器
        const wrapper = document.querySelector('.scratch-card-wrapper');
        wrapper.appendChild(preview);
    }
    
    updateProgress(progress = 0) {
        const roundedProgress = Math.round(progress);
        this.progressFill.style.width = `${roundedProgress}%`;
        this.progressText.textContent = `${roundedProgress}%`;
        
        // 添加颜色变化效果
        if (roundedProgress < 30) {
            this.progressFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
        } else if (roundedProgress < 70) {
            this.progressFill.style.background = 'linear-gradient(90deg, #4ECDC4, #44A08D)';
        } else {
            this.progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        }
    }
    
    async loadNewPrize() {
        try {
            const response = await fetch('/Home/GetNewPrize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentPrize = result;
                this.prizeText.textContent = result.prize;
                this.prizeDisplay.style.background = `linear-gradient(45deg, ${result.color}, #FFF)`;
            }
        } catch (error) {
            console.error('加载奖品失败:', error);
            this.prizeText.textContent = '🎁 神秘大奖';
        }
    }
    
    reveal() {
        if (this.isRevealed) return;
        
        this.isRevealed = true;
        
        // 清除整个画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 清除所有提示元素
        this.clearHints();
        
        // 更新进度到100%
        this.updateProgress(100);
        
        // 添加庆祝动画
        this.prizeText.classList.add('bounce');
        setTimeout(() => {
            this.prizeText.classList.remove('bounce');
        }, 1000);
        
        // 播放庆祝效果
        this.showCelebration();
    }
    
    clearHints() {
        // 清除所有提示和预览元素
        const hints = document.querySelectorAll('.scratch-hint, .prize-preview');
        hints.forEach(hint => hint.remove());
    }
    
    showCelebration() {
        // 创建彩带效果
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }
    
    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            document.body.removeChild(confetti);
        };
    }
    
    async reset() {
        // 清除所有提示元素
        this.clearHints();
        
        await this.loadNewPrize();
        this.drawScratchLayer();
        
        // 重置按钮动画
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.classList.add('sparkle');
        setTimeout(() => {
            resetBtn.classList.remove('sparkle');
        }, 1000);
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new ScratchCard();
});