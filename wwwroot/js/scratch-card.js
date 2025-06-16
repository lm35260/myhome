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
        
        // 设置擦除模式
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
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
        
        // 如果刮开面积超过30%，显示完整奖品
        if (progress > 30 && !this.isRevealed) {
            this.reveal();
        }
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