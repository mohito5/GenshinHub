// modal-manager.js - управление модальными окнами
export const modalManager = {
    activeModals: [],
    modalTypes: {},
    notifications: [],
    
    registerNotification: function(notification) {
        this.notifications.push(notification);
    },
    
    unregisterNotification: function(notification) {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    },
    
    translateAll: function(lang) {
        // Переводим все модальные окна
        this.modals.forEach(modal => {
            if (modal.translate && typeof modal.translate === 'function') {
                modal.translate(lang);
            }
        });
        
        // Переводим все уведомления
        this.notifications.forEach(notification => {
            if (notification.translate && typeof notification.translate === 'function') {
                notification.translate(lang);
            }
        });
    },
    
    registerModal: function(modal, type) {
        if (!this.activeModals.includes(modal)) {
            this.activeModals.push(modal);
            if (type) {
                this.modalTypes[modal] = type;
            }
            console.log('Модальное окно зарегистрировано. Тип:', type, 'Всего активных:', this.activeModals.length);
        }
    },
    
    unregisterModal: function(modal) {
        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
            delete this.modalTypes[modal];
            console.log('Модальное окно удалено. Осталось активных:', this.activeModals.length);
        }
    },
    
    closeAllByType: function(type) {
        console.log('Закрытие всех модальных окон типа:', type);
        const modalsToClose = [...this.activeModals];
        modalsToClose.forEach(modal => {
            if (modal && modal.parentNode && this.modalTypes[modal] === type) {
                modal.remove();
                this.unregisterModal(modal);
            }
        });
    },
    
    closeAllExceptType: function(type) {
        console.log('Закрытие всех модальных окон, кроме типа:', type);
        const modalsToClose = [...this.activeModals];
        modalsToClose.forEach(modal => {
            if (modal && modal.parentNode && this.modalTypes[modal] !== type) {
                modal.remove();
                this.unregisterModal(modal);
            }
        });
    },
    
    closeAll: function() {
        console.log('Закрытие всех активных модальных окон');
        const modalsToClose = [...this.activeModals];
        modalsToClose.forEach(modal => {
            if (modal && modal.parentNode) {
                modal.remove();
            }
        });
        this.activeModals = [];
        this.modalTypes = {};
    },
    
    hasModalOfType: function(type) {
        return Object.values(this.modalTypes).includes(type);
    },
    
    translateAll: function(lang) {
        console.log('Перевод всех модальных окон на язык:', lang);
        this.activeModals.forEach(modal => {
            if (modal && modal.parentNode && typeof modal.translate === 'function') {
                modal.translate(lang);
            }
        });
    },
    
};

// Экспортируем в глобальную область
if (typeof window !== 'undefined') {
    window.modalManager = modalManager;
}