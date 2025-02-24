let quotes;
const cachedQuotes = localStorage.getItem('quotes');
if (cachedQuotes) {
    quotes = JSON.parse(cachedQuotes);
    initApp(quotes);
} else {
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            localStorage.setItem('quotes', JSON.stringify(quotes));
            initApp(quotes);
        })
        .catch(error => console.error('حدث خطأ أثناء تحميل الجمل:', error));
}

function initApp(data) {
    const quotes = data;
    const randomButton = document.getElementById('randomButton');
    const categorySelect = document.getElementById('categorySelect');
    const copyButton = document.getElementById('copyButton');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const darkModeButton = document.getElementById('darkModeButton');

    const shareButton = document.createElement('button');
    shareButton.textContent = 'مشاركة';
    shareButton.id = 'shareButton';
    document.querySelector('.buttons-container').appendChild(shareButton);

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

    function formatQuote(quote, type) {
        if (type === 'poetry') {
            return quote.replace(/\n/g, '<br>');
        }
        return quote;
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
        return {
            text: filteredQuotes[randomIndex].text,
            type: filteredQuotes[randomIndex].type
        };
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
        const quoteObj = getRandomQuote(selectedCategory === 'all' ? null : selectedCategory);

        if (quoteObj) {
            quoteDisplay.innerHTML = formatQuote(quoteObj.text, quoteObj.type);
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

    shareButton.addEventListener('click', () => {
        const textToShare = quoteDisplay.textContent;
        if (!textToShare) {
            showNotification('لا توجد جملة لمشاركتها!');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'كلمة من القلب',
                text: textToShare,
                url: window.location.href
            })
                .then(() => {
                    showNotification('تمت المشاركة بنجاح!');
                })
                .catch(err => {
                    console.error('حدث خطأ أثناء المشاركة:', err);
                    showNotification('فشلت المشاركة، حاول مرة أخرى.');
                });
        } else {
            navigator.clipboard.writeText(textToShare)
                .then(() => {
                    showNotification('تم نسخ النص! يمكنك لصقه في أي منصة.');
                })
                .catch(err => {
                    console.error('حدث خطأ:', err);
                    showNotification('فشل النسخ، حاول مرة أخرى.');
                });
        }
    });
}