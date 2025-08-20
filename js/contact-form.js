// Contact form handling
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton.textContent;
        this.apiUrl = 'https://your-server-url.com/api/contact'; // Update with your server URL

        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });

            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const isValid = input.checkValidity();
        input.classList.toggle('invalid', !isValid);
        
        if (!isValid) {
            this.showError(input);
        } else {
            this.clearError(input);
        }
    }

    showError(input) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = input.validationMessage;
            input.parentElement.appendChild(error);
        }
    }

    clearError(input) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.form.checkValidity()) {
            return;
        }

        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            this.setLoading(true);
            const response = await this.submitForm(data);
            
            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                const error = await response.json();
                this.showError(error.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError('Failed to send message. Please try again later.');
        } finally {
            this.setLoading(false);
        }
    }

    async submitForm(data) {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.submitButton.textContent = isLoading ? 'Sending...' : this.originalButtonText;
        
        if (isLoading) {
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.classList.remove('loading');
        }
    }

    showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Message sent successfully!';
        
        this.form.insertAdjacentElement('beforebegin', successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        this.form.insertAdjacentElement('beforebegin', errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contact-form');
});
