// modal-manager.js - управление модальными окнами
export const modalManager = {
    activeModals: [],
    modalTypes: {},
    
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
        console.log('Перевод всех модальных окон на язык:', lang, 'активных окон:', this.activeModals.length);
        
        this.activeModals.forEach(modal => {
            if (modal && modal.parentNode) {
                try {
                    // Если у модального окна есть метод translate, вызываем его
                    if (typeof modal.translate === 'function') {
                        console.log('Перевод модального окна:', modal.className);
                        modal.translate(lang);
                    } else {
                        console.warn('Модальное окно не имеет метода translate:', modal.className);
                    }
                } catch (error) {
                    console.error('Ошибка при переводе модального окна:', error);
                }
            }
        });
    }
};

// Экспортируем в глобальную область
if (typeof window !== 'undefined') {
    window.modalManager = modalManager;
}