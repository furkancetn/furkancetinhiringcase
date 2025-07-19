(function() {

    const ModuleConfiguration = {
        ModuleName: "FURKAN_ÇETİN",
        ModuleVersion: "1.0.0",
        ModuleDescription: "A module for managing products and favorites for recommendation system.",
        ModuleAuthor: "Furkan Çetin",
        ModuleFavoriteStorageKey: "favorites",
        ModuleProductStorageKey: "products",
        ModuleProductAPIURL: "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
        ModuleTargetURL: "https://www.e-bebek.com/",
        ModuleDisplayTitle: "Beğenebileceğinizi düşündüklerimiz",
       };

    let products = [];
    let favorites = JSON.parse(localStorage.getItem(ModuleConfiguration.ModuleFavoriteStorageKey)) || [];


    function targetUrlCheck() {
        const currentUrl = window.location.href;
        if (currentUrl !== ModuleConfiguration.ModuleTargetURL || currentUrl.indexOf(ModuleConfiguration.ModuleTargetURL) === -1) {
            console.error(`Current URL (${currentUrl}) does not match target URL (${ModuleConfiguration.ModuleTargetURL}). Module will not function properly.`);
            return false;
        }
        return true;
    }

    async function fetchProducts() {
        try {
            const response = await fetch(ModuleConfiguration.ModuleProductAPIURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data || data.products || []; // data may be an object with a products property or an array directly (in github gist it is an array)
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    function loadProductsFromStorage() {
        const storedProducts = localStorage.getItem(ModuleConfiguration.ModuleProductStorageKey);
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            if (products && products.length > 0 && Array.isArray(products)) { 
                return true; 
            } else {
                return false; 
            }
        } else {
            return false;
        }
    }

    function saveFavoritesToStorage() {
        localStorage.setItem(ModuleConfiguration.ModuleFavoriteStorageKey, JSON.stringify(favorites));
    }

    function addProductToFavorites(productId) {
        const product = products.find(p => p.id === productId);
        if (product && !favorites.some(fav => fav.id === productId)) {
            favorites.push(product);
            saveFavoritesToStorage();
        } else {
            if (!product) {
                console.warn(`Product with ID ${productId} does not exist in the product list.`);
            } else {
                removeProductFromFavorites(productId);
            }
        }
    }

    function removeProductFromFavorites(productId) {
        const index = favorites.findIndex(fav => fav.id === productId);
        if (index !== -1) {
            favorites.splice(index, 1);
            saveFavoritesToStorage();
        } else {
            console.warn(`Product ${productId} is not in favorites or does not exist.`);
        }
    }

    function createCarousel(){

        const mainContainer = document.createElement('div');
        mainContainer.className = 'FC-main-container';
        const container = document.createElement('div');
        container.className = 'FC-carousel';
        const titleSection = document.createElement('div');
        titleSection.className = 'FC-title-section';
        const title = document.createElement('h2');
        title.className = 'FC-title';
        title.textContent = ModuleConfiguration.ModuleDisplayTitle || "Beğenebileceğinizi düşündüklerimiz";
        titleSection.appendChild(title);
        container.appendChild(titleSection);

        const wrapper = document.createElement('div');
        wrapper.className = 'FC-products-wrapper';
        container.appendChild(wrapper);
        
        const track = document.createElement('div');
        track.className = 'FC-products-track';
        wrapper.appendChild(track);

        mainContainer.appendChild(container);
        const prevButton = document.createElement('button');
        prevButton.className = 'FC-nav-button prev';
        prevButton.innerHTML = '<img class="icon icon-prev" src="https://www.e-bebek.com/assets/svg/prev.svg"></img>';
        mainContainer.appendChild(prevButton);
        
        const nextButton = document.createElement('button');
        nextButton.className = 'FC-nav-button next';
        nextButton.innerHTML = '<img class="icon icon-next" src="https://www.e-bebek.com/assets/svg/next.svg"></img>';
        mainContainer.appendChild(nextButton);

        products.forEach(product => {
            const productCard = createProductCard(product);
            track.appendChild(productCard);
        });

        let currentIndex = 0;
        
        const getItemsPerView = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1480) {
                return 5;
            } else if (screenWidth >= 1200) {
                return 4;
            } else if (screenWidth >= 980) {
                return 3;
            } else {
                return 2;
            }
        };
        
        const updateSlider = () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, products.length - itemsPerView);
            

            currentIndex = Math.min(currentIndex, maxIndex);
            

            prevButton.disabled = currentIndex <= 0;
            nextButton.disabled = currentIndex >= maxIndex;
            
            prevButton.style.opacity = currentIndex > 0 ? '1' : '0.5';
            nextButton.style.opacity = currentIndex < maxIndex ? '1' : '0.5';
            

            const translateX = -(currentIndex * (100 / itemsPerView));
            track.style.transform = `translateX(${translateX}%)`;
            
        };

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        nextButton.addEventListener('click', () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, products.length - itemsPerView);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        let startX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {

                    const itemsPerView = getItemsPerView();
                    const maxIndex = Math.max(0, products.length - itemsPerView);
                    if (currentIndex < maxIndex) {
                        currentIndex++;
                        updateSlider();
                    }
                } else {

                    if (currentIndex > 0) {
                        currentIndex--;
                        updateSlider();
                    }
                }
            }
        });

        let isMouseDown = false;
        let mouseStartX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        
        track.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
            track.style.cursor = 'grabbing';
            
            const itemsPerView = getItemsPerView();
            prevTranslate = -(currentIndex * (100 / itemsPerView));
            currentTranslate = prevTranslate;
            
            track.style.transition = 'none';
            
            e.preventDefault();
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            
            const currentX = e.clientX;
            const diffX = currentX - mouseStartX;
            const itemsPerView = getItemsPerView();
            
            const containerWidth = wrapper.offsetWidth;
            const dragPercentage = (diffX / containerWidth) * 100;
            
            currentTranslate = prevTranslate + dragPercentage;
            
            
            const maxTranslate = 0;
            const minTranslate = -((products.length - itemsPerView) * (100 / itemsPerView));
            
            currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
            
            track.style.transform = `translateX(${currentTranslate}%)`;
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            track.style.cursor = 'grab';
            
            
            track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const itemsPerView = getItemsPerView();
            const cardWidth = 100 / itemsPerView;
            
            
            const targetIndex = Math.round(-currentTranslate / cardWidth);
            const maxIndex = Math.max(0, products.length - itemsPerView);
            
            
            currentIndex = Math.max(0, Math.min(maxIndex, targetIndex));
            
            
            updateSlider();
        });
        
        track.addEventListener('mouseleave', () => {
            if (isMouseDown) {
                isMouseDown = false;
                track.style.cursor = 'grab';
                
                track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                
                const itemsPerView = getItemsPerView();
                const cardWidth = 100 / itemsPerView;
                const targetIndex = Math.round(-currentTranslate / cardWidth);
                const maxIndex = Math.max(0, products.length - itemsPerView);
                
                currentIndex = Math.max(0, Math.min(maxIndex, targetIndex));
                updateSlider();
            }
        });

        track.addEventListener('dragstart', (e) => {
            e.preventDefault(); 
        });

        setTimeout(() => {
            updateSlider();
        }, 100);
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, products.length - itemsPerView);
                currentIndex = Math.min(currentIndex, maxIndex);
                updateSlider();
            }, 250);
        });

        return mainContainer;
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'FC-product-card';
        const setCardSize = () => {
            const screenWidth = window.innerWidth;
            let itemsPerView;
            
            if (screenWidth >= 1480) {
                itemsPerView = 5;
            } else if (screenWidth >= 1200) {
                itemsPerView = 4;
            } else if (screenWidth >= 980) {
                itemsPerView = 3;
            } else {
                itemsPerView = 2;
            }
            
            const cardWidthPercentage = (100 / itemsPerView)-1 + '%';
            card.style.width = cardWidthPercentage;
            card.style.minWidth = cardWidthPercentage;
            card.style.flexShrink = '0';
        };
        
        setCardSize();
        window.addEventListener('resize', setCardSize);
        
        const isFavorite = favorites.some(fav => fav.id === product.id);
        const hasDiscount = product.original_price && parseFloat(product.original_price) > parseFloat(product.price);
        const discountPercentage = hasDiscount
            ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)
            : null;

        card.innerHTML = `
          <div class="FC-product-image-container">
            <img src="${product.img}" alt="${product.name}" class="FC-product-image">
            <button class="FC-favorite-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}"> 
              <img width="25" height="25" src="${isFavorite ? 'https://www.e-bebek.com/assets/svg/favorite.svg' : 'https://www.e-bebek.com/assets/svg/default-favorite.svg'}" alt="Favorite">
            </button>
          </div>
          <div class="FC-product-info">
            <div class="FC-product-content">
              <h3 class="FC-product-title">
                <div class="FC-brand">${product.brand} - </div>
                ${product.name}
              </h3>
              <div class="FC-rating">
                ${'★'.repeat(4)}${'☆'.repeat(1)}
                <span class="FC-rating-count">(${Math.floor(Math.random() * 200) + 1})</span>
              </div>
            </div>
            <div class="FC-price-container">
              <div class="FC-price-top-row">
                <span class="FC-old-price">${hasDiscount ? parseFloat(product.original_price).toFixed(2) + ' TL' : ''}</span>
                ${hasDiscount ? `<span class="FC-discount-badge">-%${discountPercentage}</span>` : ''}
              </div>
              <div class="FC-price-discount-row">
                <span class="FC-current-price">${parseFloat(product.price).toFixed(2)} TL</span>
              </div>
            </div>
            <button class="FC-cart-btn">Sepete Ekle</button>
          </div>
        `;

        const favoriteButton = card.querySelector('.FC-favorite-btn');
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(favoriteButton.getAttribute('data-id'), 10);
            addProductToFavorites(productId);
            favoriteButton.classList.toggle('active');
            favoriteButton.querySelector('img').src = favoriteButton.classList.contains('active')
                ? 'https://www.e-bebek.com/assets/svg/favorite.svg'
                : 'https://www.e-bebek.com/assets/svg/default-favorite.svg';
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('.FC-favorite-btn') || e.target.closest('.FC-cart-btn')) {
                return;
            }
            window.open(product.url || '', '_blank');

        });

        card.style.cursor = 'pointer';

        return card;
    }

    function createStyles() {
        // E bebek sitesini inceledim ve CSS stillerini buna göre oluşturdum. Tam değerler karşılanmamış olabilir. Özellikle bazı fontlar,renkler ve boyutlar tam olarak eşleşmeyebilir.
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            
            .FC-main-container {
                position: relative;
                width: 100%;
                max-width: 1480px; 
                display: flex;
                align-items: center;
                justify-content: center;
                margin: auto;
                padding: 15px 80px; 
            }
            
            .FC-carousel * {
                box-sizing: border-box !important;
            }
            
            
            .FC-carousel .FC-products-track,
            .FC-carousel .FC-product-card {
                float: none !important;
                clear: none !important;
                position: relative !important;
            }
            
            .FC-carousel {
                position: relative;
                width: 100%;
                max-width: 1320px;
                margin: 0;
                overflow: hidden;
                padding: 5px 15px 5px 15px;
                background-color: transparent; 
                box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
                border-bottom-left-radius: 35px;
                border-bottom-right-radius: 35px;
            }
            
            .FC-title-section {
                background: #fef6eb;
                padding: 25px 67px;
                width: 100%; 
                max-width: 1320px; 
                margin-left: auto;
                margin-right: auto;
                border-top-left-radius: 35px;
                border-top-right-radius: 35px;
                box-sizing: border-box; 
            }
            
            .FC-title {
                margin: 0;
                font-size: clamp(18px, 4vw, 28px); 
                font-weight: 700;
                font-family: Quicksand-Bold, sans-serif;
                color: #f39c12;
                text-align: left;
            }
            
            
            .FC-products-wrapper {
                position: relative;
                width: 100%;
                max-width: 100%;
                overflow: hidden;
                padding: 0;
                margin: 0 auto;
            }
            
            .FC-products-track {
                display: flex !important;
                flex-direction: row !important;
                gap: 0; 
                padding: 20px 0 20px 0;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform;
                flex-wrap: nowrap !important;
                align-items: flex-start;
                cursor: grab;
            }
            
            .FC-products-track:active {
                cursor: grabbing;
            }
            
            .FC-product-card {
                background: #fff;
                border: 1px solid #ededed;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
                transition: all 0.3s ease;
                flex-shrink: 0 !important;
                flex-grow: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                float: none !important;
                clear: none !important;
                padding: 20px;  
                box-sizing: border-box;
                margin: 0 7px;
            }
            
            .FC-product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-color: #f49907ff;
                border-width: 3px;
            }
            
            .FC-product-card > * {
                border-radius: 8px;
                background: #fff;
            }
            
            .FC-product-card > .FC-product-image-container {
                flex-shrink: 0;
            }
            
            .FC-product-card > .FC-product-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 20px;
            }
            
            .FC-product-badges {
                position: absolute;
                top: 8px;
                left: 8px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .FC-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                color: white;
            }
            
            
            
            .FC-badge-discount {
                background: #f97316;
            }
            
            .FC-product-image-container {
                position: relative;
                max-width: 100%;
                height: 200px;
                overflow: hidden;
                margin-bottom: 65px;
            }
            
            .FC-product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .FC-product-card:hover .FC-product-image {
                transform: scale(1.05);
            }
            
            .FC-favorite-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 3;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .FC-favorite-btn:hover {
                background: rgba(255, 255, 255, 1);
                transform: scale(1.1);
            }
            
            .FC-favorite-btn.active {
                background: rgba(255, 107, 53, 0.1);
            }
            
            .FC-product-info {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            .FC-product-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                space-between: 8px;
                justify-content: space-between;
            }
            
            .FC-brand {
                font-size: 1.2rem;
                color: #6b7280;
                font-weight: 900;
                margin-bottom: 4px;
            }
            
            .FC-product-title {
                font-size: 1.2rem;
                font-weight: 700;
                color: #7D7D7D;
                line-height: 1.4;
                margin: 0 0 8px 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 36px;
            }
            
            .FC-rating {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 5px;
                font-size: 22px;
                color: #fed100;
                padding: 15px 0px 15px 0px; 
            }
            
            .FC-rating-count {
                font-size: 12px;
                color: #6b7280;
            }
            
            .FC-price-container {
                padding-bottom: 15px;
                margin-bottom: 8px;
                min-height: 45px; 
            }
            
            .FC-price-top-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;
                min-height: 20px; 
            }
            
            .FC-old-price {
                font-size: 12px;
                color: #9ca3af;
                text-decoration: line-through;
                flex: 1;
            }
            
            .FC-discount-badge {
                background: green;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                margin-left: 8px;
            }
            
            .FC-price-discount-row {
                display: flex;
                align-items: center;
                min-height: 24px; 
            }
            
            .FC-current-price {
                font-size: 21px;
                font-weight: 700;
                color: #7D7D7D;
            }
            
    
            
            .FC-cart-btn {
                width: 100%;
                height: 48px;
                background: #fff7ec;
                color: #f28e00;
                border: none;
                padding: 15px;
                border-radius: 37.5px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.2s ease;
                z-index: 2;
                position: relative;
            }
            
            .FC-cart-btn:hover {
                background: #d97706;
                color: #fff;
                transform: scale(1.02);
            }
            
            .FC-nav-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: #fef6eb;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                font-weight: normal;
                font-family: Quicksand-Medium, sans-serif;
            }
            
            .FC-nav-button:hover {
                background: #ffffff;    
                border: 1px solid;
                border-color: #f39c12;
            }
            
            .FC-nav-button:active {
                transform: translateY(-50%) scale(0.95);
            }
            
            .FC-nav-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }
            
            .FC-nav-button.prev {
                left: 10px; 
            }
            
            .FC-nav-button.next {
                right: 10px; 
            }
            
            
                
            @media (max-width: 1400px) {
                .FC-main-container {
                    max-width: 100%;
                    padding: 0 80px; 
                }
                
                .FC-carousel {
                    width: 100%;
                    margin: 0;
                }
                
                .FC-title-section {
                    padding: 20px 40px;     
                }
            }
            
            @media (max-width: 768px) {
                .FC-main-container {
                    padding: 0 60px; 
                }
                
                .FC-carousel {
                    width: 100%;
                    padding: 5px 10px;
                }
                
                .FC-title-section {
                    padding: 15px 20px;     
                    border-radius: 20px 20px 0 0;   
                }
                
                .FC-title {
                    font-size: clamp(16px, 5vw, 22px);  
                }
                
                .FC-products-wrapper {
                    max-width: 100%;
                }
                
                .FC-nav-button {
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                }
                
                .FC-nav-button.prev {
                    left: 10px;
                }
                
                .FC-nav-button.next {
                    right: 10px;
                }
                
                .FC-product-card {
                    padding: 15px;  
                    margin: 0 4px;  
                }
            }
            
            @media (max-width: 480px) {
                .FC-main-container {
                    padding: 0 40px; 
                }
                
                .FC-title-section {
                    padding: 12px 15px;
                    border-radius: 15px 15px 0 0;
                }
                
                .FC-carousel {
                    padding: 5px 8px;
                    border-radius: 0 0 15px 15px;
                }
                
                .FC-product-card {
                    padding: 12px;
                    margin: 0 3px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async function init() {

        if (!targetUrlCheck()) {
            return;
        }

        if (!loadProductsFromStorage()) {
            products = await fetchProducts();
            if (products && products.length > 0 && Array.isArray(products)) {
                localStorage.setItem(ModuleConfiguration.ModuleProductStorageKey, JSON.stringify(products));
            } else {
                console.error("No products fetched from API.");
                return;
            }
        } else {
            console.log("Products loaded from localStorage successfully.");
        }

        if (favorites.length === 0) {
            favorites = [];
        } else {
            console.log("Favorites loaded from localStorage:", favorites);
        }

        const storiesSection = document.querySelector('.stories-section, .story-section, [class*="stories"], [class*="story"]'); // Websitesini incelediğimde bu kısımları buldum.

        if (!storiesSection) {
            console.error("Stories section not found on the page.");
            return;
        }

        const carousel = createCarousel();
        createStyles();
        if (!carousel) {
            console.error("Failed to create carousel.");
            return;
        }

        if (!document.querySelector('.FC-main-container')) {
            storiesSection.insertAdjacentElement('afterend', carousel); 
        }

        console.log("Module initialized successfully. Products and favorites are ready to use.");

    }

    init().then(() => {
        console.log("Module initialized with configuration:", ModuleConfiguration);
    }).catch((error) => {
        console.error("Error initializing module:", error);
    });



})();