// Sistema de Gerenciamento de Usuários e Finanças
class FinanceApp {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('financeUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    // Navegação entre telas
    showScreen(screenId) {
        const screens = ['loginScreen', 'registerScreen', 'forgotScreen', 'dashboardScreen', 'profileScreen'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) element.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.remove('hidden');
        
        this.clearFeedback();
    }

    // Registro de usuário
    register(name, email, password, confirmPassword, photoFile) {
        if (!name || !email || !password) {
            return this.showFeedback('Preencha todos os campos obrigatórios', 'error');
        }

        if (this.users.find(u => u.email === email)) {
            return this.showFeedback('E-mail já cadastrado', 'error');
        }

        if (password !== confirmPassword) {
            return this.showFeedback('As senhas não coincidem', 'error');
        }

        if (password.length < 6) {
            return this.showFeedback('A senha deve ter pelo menos 6 caracteres', 'error');
        }

        let photoUrl = '';
        if (photoFile) {
            photoUrl = URL.createObjectURL(photoFile);
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            photo: photoUrl,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        
        this.showFeedback('Conta criada com sucesso!', 'success');
        setTimeout(() => this.showScreen('loginScreen'), 1500);
    }

    // Login
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showScreen('dashboardScreen');
            this.updateDashboard();
        } else {
            this.showFeedback('E-mail ou senha incorretos', 'error');
        }
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showScreen('loginScreen');
    }

    // Atualizar perfil
    updateProfile(name, email, newPassword, photoFile) {
        if (!this.currentUser) return;

        if (this.users.find(u => u.email === email && u.id !== this.currentUser.id)) {
            return this.showFeedback('E-mail já está em uso', 'error');
        }

        this.currentUser.name = name;
        this.currentUser.email = email;

        if (newPassword && newPassword.length >= 6) {
            this.currentUser.password = newPassword;
        }

        if (photoFile) {
            this.currentUser.photo = URL.createObjectURL(photoFile);
        }

        // Atualizar no array de usuários
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
        }

        this.saveUsers();
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showFeedback('Perfil atualizado com sucesso!', 'success');
        this.updateDashboard();
    }

    // Adicionar transação
    addTransaction(description, amount, type) {
        if (!this.currentUser) return;

        const transaction = {
            id: Date.now(),
            userId: this.currentUser.id,
            description,
            amount: parseFloat(amount),
            type, // 'income' ou 'expense'
            date: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateDashboard();
        this.showFeedback('Transação adicionada com sucesso!', 'success');
    }

    // Remover transação
    removeTransaction(transactionId) {
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        this.saveTransactions();
        this.updateDashboard();
        this.showFeedback('Transação removida com sucesso!', 'success');
    }
    calculateBalance() {
        if (!this.currentUser) return 0;

        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        const income = userTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = userTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        return income - expenses;
    }

    // Calcular estatísticas
    calculateStats() {
        if (!this.currentUser) return { income: 0, expenses: 0, transactions: 0 };

        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        const income = userTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = userTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        return {
            income,
            expenses,
            transactions: userTransactions.length
        };
    }

    // Atualizar dashboard
    updateDashboard() {
        if (!this.currentUser) return;

        const userNameEl = document.getElementById('userName');
        const userPhotoEl = document.getElementById('userPhoto');
        const balanceEl = document.getElementById('balance');

        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        
        if (userPhotoEl && this.currentUser.photo) {
            userPhotoEl.src = this.currentUser.photo;
            userPhotoEl.style.display = 'block';
        }

        if (balanceEl) {
            const balance = this.calculateBalance();
            balanceEl.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
            balanceEl.className = balance >= 0 ? 'balance-amount' : 'balance-amount text-warning';
        }

        this.updateStatsCards();
        this.updateTransactionsList();
        this.updateProfileForm();
    }

    // Atualizar cards de estatísticas
    updateStatsCards() {
        const stats = this.calculateStats();
        
        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpensesEl = document.getElementById('totalExpenses');
        const totalTransactionsEl = document.getElementById('totalTransactions');

        if (totalIncomeEl) {
            totalIncomeEl.textContent = `R$ ${stats.income.toFixed(2).replace('.', ',')}`;
        }
        
        if (totalExpensesEl) {
            totalExpensesEl.textContent = `R$ ${stats.expenses.toFixed(2).replace('.', ',')}`;
        }
        
        if (totalTransactionsEl) {
            totalTransactionsEl.textContent = stats.transactions;
        }
    }

    // Atualizar formulário de perfil
    updateProfileForm() {
        if (!this.currentUser) return;

        const nameEl = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        const photoEl = document.getElementById('userPhoto');

        if (nameEl) nameEl.value = this.currentUser.name;
        if (emailEl) emailEl.value = this.currentUser.email;
        
        if (photoEl && this.currentUser.photo) {
            photoEl.src = this.currentUser.photo;
            photoEl.style.display = 'block';
        }
    }

    // Salvar perfil
    saveProfile() {
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const password = document.getElementById('profilePassword').value;
        const photoFile = document.getElementById('profilePhoto').files[0];

        this.updateProfile(name, email, password, photoFile);
        document.getElementById('profilePassword').value = ''; // Limpar campo senha
    }

    // Atualizar lista de transações
    updateTransactionsList() {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList || !this.currentUser) return;

        const userTransactions = this.transactions
            .filter(t => t.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (userTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-inbox display-1 text-muted opacity-50"></i>
                    <p class="text-muted mt-3">Nenhuma transação encontrada.</p>
                    <small class="text-muted">Adicione sua primeira transação acima!</small>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = userTransactions.map(t => `
            <div class="transaction-item ${t.type} d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <i class="bi ${t.type === 'income' ? 'bi-arrow-down-circle text-success' : 'bi-arrow-up-circle text-danger'} fs-4"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">${t.description}</div>
                        <small class="text-muted">
                            <i class="bi bi-calendar3 me-1"></i>
                            ${new Date(t.date).toLocaleDateString('pt-BR')}
                        </small>
                    </div>
                </div>
                <div class="text-end d-flex align-items-center">
                    <div class="fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'} me-2">
                        ${t.type === 'income' ? '+' : '-'}R$ ${t.amount.toFixed(2).replace('.', ',')}
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.removeTransaction(${t.id})" title="Remover">
                        ×
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Verificar estado de autenticação
    checkAuthState() {
        if (this.currentUser) {
            this.showScreen('dashboardScreen');
            this.updateDashboard();
        } else {
            this.showScreen('loginScreen');
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners serão configurados quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
        });
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                this.login(email, password);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('regConfirmPassword').value;
                const photoFile = document.getElementById('regPhoto').files[0];
                this.register(name, email, password, confirmPassword, photoFile);
            });
        }

        // Transaction form
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const description = document.getElementById('transactionDescription').value;
                const amount = document.getElementById('transactionAmount').value;
                const type = document.getElementById('transactionType').value;
                this.addTransaction(description, amount, type);
                transactionForm.reset();
            });
        }
    }

    // Salvar dados
    saveUsers() {
        localStorage.setItem('financeUsers', JSON.stringify(this.users));
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    // Feedback
    showFeedback(message, type) {
        const feedbackEl = document.getElementById('feedback');
        if (feedbackEl) {
            feedbackEl.innerHTML = `<div class="feedback ${type}">${message}</div>`;
            setTimeout(() => this.clearFeedback(), 5000);
        }
    }

    clearFeedback() {
        const feedbackEl = document.getElementById('feedback');
        if (feedbackEl) feedbackEl.innerHTML = '';
    }
}

// Inicializar aplicação
const app = new FinanceApp();
