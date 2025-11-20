// Set the hidden field to the current date/time when the page loads
document.getElementById('form-timestamp').value = new Date().toISOString();

// Modal and animation behavior
document.addEventListener('DOMContentLoaded', function () {
    // Entrance animation for cards (staggered)
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
        var delay = parseInt(card.getAttribute('data-animate-delay') || 0, 10);
        setTimeout(function () {
            card.classList.add('card-enter');
        }, delay);
    });

    // Modal logic
    var activeModal = null;
    var lastFocus = null;

    function trapFocus(modal) {
        var focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        focusable = Array.prototype.slice.call(focusable);
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        function handleKey(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            } else if (e.key === 'Escape' || e.key === 'Esc') {
                closeModal(modal);
            }
        }

        modal.addEventListener('keydown', handleKey);
        modal._removeKeyHandler = function () {
            modal.removeEventListener('keydown', handleKey);
        };
    }

    function openModal(modal) {
        if (!modal) return;
        lastFocus = document.activeElement;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('open');
        activeModal = modal;
        // focus the close button
        var closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
        trapFocus(modal);
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('open');
        if (modal._removeKeyHandler) modal._removeKeyHandler();
        activeModal = null;
        if (lastFocus) lastFocus.focus();
    }

    // Open modal buttons
    var infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var id = btn.getAttribute('data-modal');
            var modal = document.getElementById(id);
            openModal(modal);
        });
    });

    // Close buttons
    var closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Click outside to close
    var modalWrappers = document.querySelectorAll('.modal');
    modalWrappers.forEach(function (m) {
        m.addEventListener('click', function (e) {
            if (e.target === m) closeModal(m);
        });
    });
});