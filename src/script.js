
        // Global variables
        let currentBalance = 0;
        let balanceVisible = true;
        let transactions = [
            {
                id: 1,
                type: 'deposit',
                description: 'Salário - Empresa XYZ',
                amount: 5000.00,
                date: new Date('2024-01-15T10:30:00'),
                status: 'completed'
            },
            {
                id: 2,
                type: 'transfer',
                description: 'Transferência para Maria Silva',
                amount: -250.00,
                date: new Date('2024-01-14T15:45:00'),
                status: 'completed'
            },
            {
                id: 3,
                type: 'payment',
                description: 'Conta de Luz - CEMIG',
                amount: -180.50,
                date: new Date('2024-01-13T09:20:00'),
                status: 'completed'
            },
            {
                id: 4,
                type: 'deposit',
                description: 'PIX Recebido - João Santos',
                amount: 75.00,
                date: new Date('2024-01-12T18:10:00'),
                status: 'completed'
            },
            {
                id: 5,
                type: 'payment',
                description: 'Supermercado ABC',
                amount: -320.80,
                date: new Date('2024-01-11T14:30:00'),
                status: 'completed'
            }
        ];

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            updateBalance();
            renderTransactions();
            
            // Toggle balance visibility
            document.getElementById('toggleBalance').addEventListener('click', toggleBalanceVisibility);
        });

        // Modal functions
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Balance functions
        function updateBalance() {
            const balanceElement = document.getElementById('balance');
            if (balanceVisible) {
                balanceElement.textContent = `R$ ${currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            } else {
                balanceElement.textContent = 'R$ ••••••';
            }
        }

        function toggleBalanceVisibility() {
            balanceVisible = !balanceVisible;
            updateBalance();
            
            const icon = document.getElementById('toggleBalance');
            icon.className = balanceVisible ? 'fas fa-eye text-white/80 text-xl cursor-pointer hover:text-white' : 'fas fa-eye-slash text-white/80 text-xl cursor-pointer hover:text-white';
        }

        // Transaction functions
        function renderTransactions() {
            const container = document.getElementById('transactionsList');
            container.innerHTML = '';

            transactions.slice(0, 5).forEach(transaction => {
                const transactionElement = createTransactionElement(transaction);
                container.appendChild(transactionElement);
            });
        }

        function createTransactionElement(transaction) {
            const div = document.createElement('div');
            div.className = 'p-4 transaction-item';
            
            const isPositive = transaction.amount > 0;
            const icon = getTransactionIcon(transaction.type);
            const color = getTransactionColor(transaction.type);
            
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 ${color} rounded-full flex items-center justify-center">
                            <i class="${icon} text-white text-sm"></i>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">${transaction.description}</p>
                            <p class="text-xs text-gray-500">${formatDate(transaction.date)}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}">
                            ${isPositive ? '+' : ''}R$ ${Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p class="text-xs text-gray-500 capitalize">${transaction.status}</p>
                    </div>
                </div>
            `;
            
            return div;
        }

        function getTransactionIcon(type) {
            const icons = {
                'deposit': 'fas fa-arrow-down',
                'transfer': 'fas fa-exchange-alt',
                'payment': 'fas fa-credit-card'
            };
            return icons[type] || 'fas fa-circle';
        }

        function getTransactionColor(type) {
            const colors = {
                'deposit': 'bg-green-500',
                'transfer': 'bg-blue-500',
                'payment': 'bg-purple-500'
            };
            return colors[type] || 'bg-gray-500';
        }

        function formatDate(date) {
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return 'Hoje';
            } else if (diffDays === 2) {
                return 'Ontem';
            } else if (diffDays <= 7) {
                return `${diffDays - 1} dias atrás`;
            } else {
                return date.toLocaleDateString('pt-BR');
            }
        }

        // Form handlers
        function handleDeposit(event) {
            event.preventDefault();
            const form = event.target;
            const amount = parseFloat(form.querySelector('input[type="number"]').value);
            const description = form.querySelector('input[type="text"]').value || 'Depósito';
            
            // Add transaction
            const newTransaction = {
                id: Date.now(),
                type: 'deposit',
                description: description,
                amount: amount,
                date: new Date(),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            currentBalance += amount;
            
            // Update UI
            updateBalance();
            renderTransactions();
            showNotification('Depósito realizado com sucesso!', 'success');
            
            // Close modal and reset form
            closeModal('depositModal');
            form.reset();
        }

