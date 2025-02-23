fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        const quotes = data;
        const randomButton = document.getElementById('randomButton');
        const categorySelect = document.getElementById('categorySelect');
        const copyButton = document.getElementById('copyButton');
        const quoteDisplay = document.getElementById('quoteDisplay');
        const darkModeButton = document.getElementById('darkModeButton');

        let isDarkMode = false;

        darkModeButton.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            const icon = darkModeButton.querySelector('i');
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('darkMode', isDarkMode);
        });

        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            isDarkMode = true;
            document.body.classList.add('dark-mode');
            const icon = darkModeButton.querySelector('i');
            icon.className = 'fas fa-sun';
        }

        let selectedCategory = 'all';

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = '#4caf50';
            notification.style.color = '#fff';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        function getRandomQuote(filterType = null) {
            let filteredQuotes = filterType
                ? quotes.filter(quote => quote.type === filterType)
                : quotes;

            if (filteredQuotes.length === 0) {
                showNotification('لا توجد جمل متاحة لهذا التصنيف!');
                return null;
            }

            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            return filteredQuotes[randomIndex].text;
        }

        categorySelect.addEventListener('change', () => {
            selectedCategory = categorySelect.value;

            if (selectedCategory === 'all') {
                randomButton.textContent = 'عشوائي';
            } else if (selectedCategory === 'poetry') {
                randomButton.textContent = 'شعر';
            } else if (selectedCategory === 'ilike') {
                randomButton.textContent = 'عبارات أعجبتني';
            }
        });

        randomButton.addEventListener('click', () => {
            const quote = getRandomQuote(selectedCategory === 'all' ? null : selectedCategory);

            if (quote) {
                quoteDisplay.textContent = quote;
                quoteDisplay.classList.remove('show');
                setTimeout(() => {
                    quoteDisplay.classList.add('show');
                }, 10);
            }
        });

        copyButton.addEventListener('click', () => {
            const textToCopy = quoteDisplay.textContent;

            if (!textToCopy) {
                showNotification('لا توجد جملة لنسخها!');
                return;
            }

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showNotification('تم نسخ الجملة إلى الحافظة!');
                })
                .catch(err => {
                    console.error('حدث خطأ أثناء النسخ:', err);
                    showNotification('لم يتمكن من نسخ الجملة. حاول مرة أخرى.');
                });
        });
    })
    .catch(error => console.error('حدث خطأ أثناء تحميل الجمل:', error));