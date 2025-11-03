class FinanceTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCategoryFilter();
        this.renderTransactions();
        this.updateSummary();
        this.setDefaultDate();
    }

    setupEventListeners() {
        // 表单提交
        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // 类型选择变化时更新分类选项
        document.getElementById('type').addEventListener('change', () => {
            this.updateCategoryOptions();
        });

        // 筛选控制
        document.getElementById('filter-type').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('filter-category').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('filter-date').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    updateCategoryOptions() {
        const type = document.getElementById('type').value;
        const categorySelect = document.getElementById('category');
        
        // 清空现有选项（保留第一个空选项）
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }

        // 根据类型添加相应选项
        const categories = this.getCategoriesByType(type);
        categories.forEach(category => {
            const option = new Option(category.label, category.value);
            categorySelect.add(option);
        });
    }

    getCategoriesByType(type) {
        const categories = {
            income: [
                { value: 'salary', label: '工资' },
                { value: 'bonus', label: '奖金' },
                { value: 'investment', label: '投资收益' },
                { value: 'other-income', label: '其他收入' }
            ],
            expense: [
                { value: 'food', label: '餐饮' },
                { value: 'shopping', label: '购物' },
                { value: 'transportation', label: '交通' },
                { value: 'housing', label: '住房' },
                { value: 'entertainment', label: '娱乐' },
                { value: 'healthcare', label: '医疗' },
                { value: 'education', label: '教育' },
                { value: 'other-expense', label: '其他支出' }
            ]
        };

        return categories[type] || [];
    }

    getCategoryLabel(value) {
        const allCategories = [
            ...this.getCategoriesByType('income'),
            ...this.getCategoriesByType('expense')
        ];
        
        const category = allCategories.find(cat => cat.value === value);
        return category ? category.label : value;
    }

    addTransaction() {
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;

        if (!category) {
            alert('请选择分类');
            return;
        }

        const transaction = {
            id: Date.now(),
            type,
            category,
            amount,
            description,
            date,
            timestamp: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.saveToLocalStorage();
        this.renderTransactions();
        this.updateSummary();
        this.updateCategoryFilter();
        
        // 重置表单
        document.getElementById('transaction-form').reset();
        this.setDefaultDate();
        this.updateCategoryOptions();

        // 显示成功消息
        this.showMessage('交易添加成功！', 'success');
    }

    deleteTransaction(id) {
        if (confirm('确定要删除这条交易记录吗？')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.renderTransactions();
            this.updateSummary();
            this.updateCategoryFilter();
            this.showMessage('交易已删除', 'success');
        }
    }

    renderTransactions() {
        const container = document.getElementById('transactions');
        const filteredTransactions = this.getFilteredTransactions();

        if (filteredTransactions.length === 0) {
            container.innerHTML = '<p class="empty-message">暂无交易记录</p>';
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <h4>${transaction.description}</h4>
                    <span class="category">${this.getCategoryLabel(transaction.category)}</span>
                </div>
                <div class="transaction-amount">
                    ${transaction.type === 'income' ? '+' : '-'}¥${transaction.amount.toFixed(2)}
                </div>
                <div class="transaction-date">
                    ${this.formatDate(transaction.date)}
                </div>
                <button class="delete-btn" onclick="tracker.deleteTransaction(${transaction.id})">
                    删除
                </button>
            </div>
        `).join('');
    }

    getFilteredTransactions() {
        const typeFilter = document.getElementById('filter-type').value;
        const categoryFilter = document.getElementById('filter-category').value;
        const dateFilter = document.getElementById('filter-date').value;

        return this.transactions.filter(transaction => {
            // 类型筛选
            if (typeFilter !== 'all' && transaction.type !== typeFilter) {
                return false;
            }

            // 分类筛选
            if (categoryFilter !== 'all' && transaction.category !== categoryFilter) {
                return false;
            }

            // 日期筛选
            if (dateFilter && transaction.date !== dateFilter) {
                return false;
            }

            return true;
        });
    }

    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        document.getElementById('total-income').textContent = `¥${totalIncome.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `¥${totalExpense.toFixed(2)}`;
        document.getElementById('balance').textContent = `¥${balance.toFixed(2)}`;

        // 根据余额设置颜色
        const balanceElement = document.getElementById('balance');
        if (balance > 0) {
            balanceElement.style.color = '#10b981';
        } else if (balance < 0) {
            balanceElement.style.color = '#ef4444';
        } else {
            balanceElement.style.color = '#6b7280';
        }
    }

    updateCategoryFilter() {
        const categorySelect = document.getElementById('filter-category');
        const currentValue = categorySelect.value;
        
        // 清空现有选项（保留第一个"所有分类"选项）
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }

        // 获取所有使用过的分类
        const usedCategories = [...new Set(this.transactions.map(t => t.category))];
        
        usedCategories.forEach(category => {
            const option = new Option(this.getCategoryLabel(category), category);
            categorySelect.add(option);
        });

        // 恢复之前的选择
        if (usedCategories.includes(currentValue)) {
            categorySelect.value = currentValue;
        }
    }

    clearFilters() {
        document.getElementById('filter-type').value = 'all';
        document.getElementById('filter-category').value = 'all';
        document.getElementById('filter-date').value = '';
        this.renderTransactions();
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    showMessage(message, type) {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;

        document.body.appendChild(messageEl);

        // 显示动画
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // 隐藏动画
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    // 导出数据为CSV
    exportToCSV() {
        const headers = ['日期', '类型', '分类', '金额', '描述'];
        const csvContent = [
            headers.join(','),
            ...this.transactions.map(t => [
                t.date,
                t.type === 'income' ? '收入' : '支出',
                this.getCategoryLabel(t.category),
                t.amount,
                `"${t.description}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `家庭记账_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 导入数据从CSV
    importFromCSV(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n').slice(1); // 跳过标题行
            
            const importedTransactions = lines
                .filter(line => line.trim())
                .map(line => {
                    const [date, typeStr, categoryStr, amountStr, description] = line.split(',');
                    
                    return {
                        id: Date.now() + Math.random(),
                        type: typeStr === '收入' ? 'income' : 'expense',
                        category: this.getCategoryValue(categoryStr),
                        amount: parseFloat(amountStr),
                        description: description.replace(/^"/, '').replace(/"$/, ''),
                        date: date,
                        timestamp: new Date().toISOString()
                    };
                });

            this.transactions = [...importedTransactions, ...this.transactions];
            this.saveToLocalStorage();
            this.renderTransactions();
            this.updateSummary();
            this.updateCategoryFilter();
            this.showMessage(`成功导入 ${importedTransactions.length} 条记录`, 'success');
        };
        
        reader.readAsText(file);
    }

    getCategoryValue(label) {
        const allCategories = [
            ...this.getCategoriesByType('income'),
            ...this.getCategoriesByType('expense')
        ];
        
        const category = allCategories.find(cat => cat.label === label);
        return category ? category.value : label;
    }
}

// 初始化应用
const tracker = new FinanceTracker();

// 添加导出功能到全局作用域
window.exportData = () => tracker.exportToCSV();

// 添加入口函数
window.importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            tracker.importFromCSV(file);
        }
    };
    input.click();
};

// 页面加载完成后初始化日期
window.addEventListener('DOMContentLoaded', () => {
    tracker.setDefaultDate();
    tracker.updateCategoryOptions();
});