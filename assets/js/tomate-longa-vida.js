'use strict';

(() => {
    const form = document.getElementById('tomato-form');
    const company = document.getElementById('company');
    const neighborhood = document.getElementById('neighborhood');
    const button = document.getElementById('contact-button');
    const fields = [company, neighborhood];
    const normalize = (value) => value.trim().replace(/\s+/g, ' ');

    function updateButton() {
        button.disabled = !fields.every((field) => normalize(field.value) && field.validity.valid);
    }

    fields.forEach((field) => field.addEventListener('input', updateButton));
    form.addEventListener('change', updateButton);
    window.addEventListener('pageshow', updateButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const emptyField = fields.find((field) => !normalize(field.value));
        if (emptyField) {
            emptyField.focus();
            updateButton();
            return;
        }
        if (!form.reportValidity()) return;

        const message = `Olá, tenho interesse no Tomate Longa Vida.\nEmpresa: ${normalize(company.value)}\nBairro: ${normalize(neighborhood.value)}`;
        const destination = `https://wa.me/5562999789984?text=${encodeURIComponent(message)}`;
        // Measure a valid WhatsApp handoff without sending form contents to Meta.
        if (typeof window.fbq === 'function') {
            try {
                window.fbq('track', 'Contact');
            } catch (error) {
                // A tracking failure must never prevent the customer from contacting us.
            }
        }
        window.setTimeout(() => window.location.assign(destination), 300);
    });

    updateButton();
})();
