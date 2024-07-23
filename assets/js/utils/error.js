class ErrorDetection {
	constructor() {
		this.injectErrorBlock();
		this.trackErrors();
	}

	// inject error block to document
	injectErrorBlock() {
		this.errorBlock = document.createElement('div');
		this.errorBlock.classList.add('error-block');
		document.body.appendChild(this.errorBlock);
	}

	errorElementConstructor({ message, type }) {
		const errorContainer = document.createElement('div');
		errorContainer.setAttribute('data-date', new Date());
		errorContainer.classList.add('error-container', type);

		const errorElement = document.createElement('div');
		errorElement.classList.add('error-element', type);
		const icon = document.createElement('i');
		if (type === 'error') icon.classList.add('fas', 'fa-exclamation-circle');
		if (type === 'warning') icon.classList.add('fas', 'fa-exclamation-triangle');
		if (type === 'info') icon.classList.add('fas', 'fa-info-circle');

		const errorMessage = document.createElement('span');
		errorMessage.classList.add('error-message');
		errorMessage.textContent = message;

		const errorCloseBtn = document.createElement('button');
		errorCloseBtn.classList.add('error-close-btn');
		errorCloseBtn.textContent = 'X';

		const expiryBlock = document.createElement('div');
		expiryBlock.classList.add('expiry-block');
		const expirySpan = document.createElement('span');
		expirySpan.classList.add('expiry-span');
		expiryBlock.appendChild(expirySpan);

		errorElement.appendChild(icon);
		errorElement.appendChild(errorMessage);
		errorElement.appendChild(errorCloseBtn);

		errorContainer.appendChild(errorElement);
		errorContainer.appendChild(expiryBlock);

		errorCloseBtn.addEventListener('click', () => {
			errorContainer.remove();
		});

		return errorContainer;
	}

	consoleError = (message) => {
		this.errorBlock.style.display = 'grid';
		this.errorBlock.appendChild(this.errorElementConstructor({ message, type: 'error' }));
		console.error(message);
	};

	consoleWarn = (message) => {
		this.errorBlock.style.display = 'grid';
		this.errorBlock.appendChild(this.errorElementConstructor({ message, type: 'warning' }));
		console.warn(message);
	};

	consoleInfo = (message) => {
		this.errorBlock.style.display = 'grid';
		this.errorBlock.appendChild(this.errorElementConstructor({ message, type: 'info' }));
		console.info(message);
	};

	trackErrors() {
		const errorContainers = document.querySelectorAll('.error-container');
		errorContainers.forEach((element) => {
			const date = new Date(element.getAttribute('data-date'));
			const currentDate = new Date();
			const timeDiff = currentDate - date;

			const expirySpan = element.querySelector('.expiry-span');
			let spanWidth = (timeDiff / 6000) * 100;
			expirySpan.style.width = `${100 - spanWidth}%`;

			if (timeDiff > 6000) element.remove();
		});

		if (errorContainers.length === 0) this.errorBlock.style.display = 'none';

		window.requestAnimationFrame(() => this.trackErrors());
	}
}

export default ErrorDetection;
