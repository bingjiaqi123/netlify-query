// 主要功能脚本
class QuerySystem {
    constructor() {
        this.currentTab = 'groups';
        this.searchQuery = '';
        this.filteredData = {};
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCurrentTab();
        this.updateStats();
        this.handleResize();
    }

    bindEvents() {
        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.trim();
            this.filterData();
            this.renderCurrentTab();
            this.updateStats();
        });

        // 清空搜索
        document.getElementById('clearSearch').addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            this.filterData();
            this.renderCurrentTab();
            this.updateStats();
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 触摸事件优化
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.optimizeForMobile();
            } else {
                this.optimizeForDesktop();
            }
        }
    }

    optimizeForMobile() {
        // 手机端优化
        document.body.classList.add('mobile');
        
        // 添加触摸反馈
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    }

    optimizeForDesktop() {
        // 桌面端优化
        document.body.classList.remove('mobile');
        
        // 移除触摸反馈
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.transform = '';
        });
    }

    switchTab(tabName) {
        // 更新标签页状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.renderCurrentTab();
        this.updateStats();
        
        // 手机端滚动到顶部
        if (this.isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    filterData() {
        if (!this.searchQuery) {
            // 如果没有搜索查询，显示所有数据
            this.filteredData = {
                groups: DATA.groups,
                daily: DATA.daily,
                weekly: DATA.weekly,
                achievements: DATA.achievements
            };
            return;
        }

        const query = this.searchQuery.toLowerCase();
        
        // 过滤数据
        this.filteredData = {
            groups: DATA.groups.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            ),
            daily: DATA.daily.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            ),
            weekly: DATA.weekly.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            ),
            achievements: DATA.achievements.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            )
        };
    }

    renderCurrentTab() {
        const container = document.getElementById(`${this.currentTab}List`);
        const data = this.filteredData[this.currentTab] || [];
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>暂无数据</h3>
                    <p>${this.searchQuery ? '没有找到匹配的搜索结果' : '该分类暂无数据'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(item => this.renderItem(item, this.currentTab)).join('');
        
        // 重新绑定触摸事件（手机端）
        if (this.isMobile) {
            this.bindTouchEvents();
        }
    }

    bindTouchEvents() {
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    }

    renderItem(item, type) {
        let rewardsHtml = '';
        
        if (type === 'groups') {
            // 组没有奖励
            rewardsHtml = '';
        } else {
            // 任务和成就显示奖励
            if (item.coin > 0) {
                rewardsHtml += `<div class="reward coin">💰 ${item.coin}</div>`;
            }
            if (item.diamond > 0) {
                rewardsHtml += `<div class="reward diamond">💎 ${item.diamond}</div>`;
            }
        }

        return `
            <div class="item-card" data-id="${item.id}" data-type="${type}">
                <div class="item-header">
                    <div class="item-id">${item.id}</div>
                    ${rewardsHtml ? `<div class="item-rewards">${rewardsHtml}</div>` : ''}
                </div>
                <div class="item-title">${item.name}</div>
                <div class="item-desc">${item.description}</div>
            </div>
        `;
    }

    updateStats() {
        const totalCount = this.getTotalCount();
        const filteredCount = this.getFilteredCount();
        
        document.getElementById('totalCount').textContent = `总计: ${totalCount}`;
        document.getElementById('filteredCount').textContent = `显示: ${filteredCount}`;
    }

    getTotalCount() {
        return DATA.groups.length + DATA.daily.length + DATA.weekly.length + DATA.achievements.length;
    }

    getFilteredCount() {
        if (!this.searchQuery) {
            return this.getTotalCount();
        }
        
        return Object.values(this.filteredData).reduce((sum, arr) => sum + arr.length, 0);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new QuerySystem();
});

// 添加一些额外的交互功能
document.addEventListener('click', (e) => {
    if (e.target.closest('.item-card')) {
        const card = e.target.closest('.item-card');
        const id = card.dataset.id;
        const type = card.dataset.type;
        
        // 复制ID到剪贴板
        navigator.clipboard.writeText(id).then(() => {
            // 显示复制成功提示
            showToast(`已复制${type === 'groups' ? '组' : type === 'daily' ? '日常任务' : type === 'weekly' ? '活动任务' : '成就'}ID: ${id}`);
        }).catch(() => {
            // 降级方案：使用传统方法复制
            const textArea = document.createElement('textarea');
            textArea.value = id;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast(`已复制${type === 'groups' ? '组' : type === 'daily' ? '日常任务' : type === 'weekly' ? '活动任务' : '成就'}ID: ${id}`);
        });
    }
});

// 显示提示信息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 手机端调整位置
    if (window.innerWidth <= 768) {
        toast.style.left = '20px';
        toast.style.right = '20px';
        toast.style.top = '10px';
        toast.style.maxWidth = 'none';
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @media (max-width: 768px) {
            @keyframes slideIn {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(-100%); opacity: 0; }
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // 3秒后自动消失
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // ESC 清空搜索
    if (e.key === 'Escape') {
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').click();
    }
    
    // 数字键快速切换标签页
    if (e.key >= '1' && e.key <= '4') {
        const tabs = ['groups', 'daily', 'weekly', 'achievements'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            // 使用实例方法切换标签页
            const querySystem = window.querySystemInstance;
            if (querySystem) {
                querySystem.switchTab(tabs[tabIndex]);
            }
        }
    }
});

// 添加响应式搜索建议
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            // 可以在这里添加搜索建议功能
            console.log('搜索建议:', query);
        }
    }, 300);
});

// 添加触摸手势支持（手机端）
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向上滑动 - 可以添加功能
            console.log('向上滑动');
        } else {
            // 向下滑动 - 可以添加功能
            console.log('向下滑动');
        }
    }
}

// 添加数据导出功能（可选）
function exportData() {
    const dataStr = JSON.stringify(DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-achievement-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// 添加数据统计功能
function showDataStats() {
    const stats = {
        groups: DATA.groups.length,
        daily: DATA.daily.length,
        weekly: DATA.weekly.length,
        achievements: DATA.achievements.length,
        total: DATA.groups.length + DATA.daily.length + DATA.weekly.length + DATA.achievements.length
    };
    
    console.log('数据统计:', stats);
    showToast(`数据统计: 组${stats.groups}个, 日常任务${stats.daily}个, 活动任务${stats.weekly}个, 成就${stats.achievements}个, 总计${stats.total}个`);
}

// 在控制台暴露一些有用的函数
window.QuerySystem = {
    showDataStats,
    exportData,
    DATA
};

// 保存实例引用
window.querySystemInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    window.querySystemInstance = new QuerySystem();
}); 