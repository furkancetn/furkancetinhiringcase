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
       };

    let products = [];
    let favorites = JSON.parse(localStorage.getItem(ModuleConfiguration.ModuleFavoriteStorageKey)) || [];


    function targetUrlCheck() {
        const currentUrl = window.location.href;
        if (currentUrl !== ModuleConfiguration.ModuleTargetURL || currentUrl.indexOf(ModuleConfiguration.ModuleTargetURL) === -1) {
            console.warn(`Current URL (${currentUrl}) does not match target URL (${ModuleConfiguration.ModuleTargetURL}). Module will not function properly.`);
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
            return data || data.products || []; // data may be an object with a products property or an array directly in github gist it is an array
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
                console.log("Products loaded from localStorage:", products);
                return true; 
            } else {
                console.warn("No products found in localStorage, will fetch from API.");
                return false; 
            }
        } else {
            console.warn("No products found in localStorage, fetching from API.");
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
            console.log(`Product ${productId} added to favorites.`);
        } else {
            if (!product) {
                console.warn(`Product with ID ${productId} does not exist in the product list.`);
            } else {
                console.warn(`Product ${productId} is removed from favorites.`);
                removeProductFromFavorites(productId);
            }
        }
    }

    function removeProductFromFavorites(productId) {
        const index = favorites.findIndex(fav => fav.id === productId);
        if (index !== -1) {
            favorites.splice(index, 1);
            saveFavoritesToStorage();
            console.log(`Product ${productId} removed from favorites.`);
        } else {
            console.warn(`Product ${productId} is not in favorites or does not exist.`);
        }
    }

    function createCarousel(){

        const container = document.createElement('div');
        container.className = 'carousel';
        const title = document.createElement('h2');
        title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
        container.appendChild(title);
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        container.appendChild(wrapper);
        const track = document.createElement('div');
        track.className = 'carousel-track';
        wrapper.appendChild(track);

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-button prev';
        prevButton.textContent = '‹';
        prevButton.addEventListener('click', () => {
            const cardWidth = 220; // 200px width + 20px gap
            const currentScroll = wrapper.scrollLeft;
            wrapper.scrollTo({ left: currentScroll - (cardWidth * 2), behavior: 'smooth' });
        });
        container.appendChild(prevButton);
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-button next';
        nextButton.textContent = '›';
        nextButton.addEventListener('click', () => {
            const cardWidth = 220; // 200px width + 20px gap
            const currentScroll = wrapper.scrollLeft;
            wrapper.scrollTo({ left: currentScroll + (cardWidth * 2), behavior: 'smooth' });
        });
        container.appendChild(nextButton);

        products.forEach(product => {
            const productCard = createProductCard(product);
            track.appendChild(productCard);
        });



        return container;
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} TL</p>
            <button class="favorite-button" style="background-color: green;" data-id="${product.id}">'Add to Favorites'</button>
        `;

        const favoriteButton = card.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', () => {
            const productId = parseInt(favoriteButton.getAttribute('data-id'), 10);
            addProductToFavorites(productId);
            favoriteButton.style.backgroundColor = favorites.some(fav => fav.id === productId) ? 'red' : 'green';
        });

        return card;
    }

    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .carousel {
                position: relative;
                width: 100%;
                overflow: hidden;
            }
            .carousel-wrapper { 
                display: flex;
                overflow-x: auto;
                scroll-behavior: smooth;
                gap: 20px; /* Gap between cards */
            }
        `;
        document.head.appendChild(style);
    }

    async function init() {
        // Modül Tasarım Planı:
        // İlk olarak modülün yapılandırmasını yapıyoruz.
        // Daha sonra, modülün çalışacağı url ile hedef url aynı mı diye kontrol ediyoruz. 
        // Bu aşamaları geçtikten sonra, ürünler ve favoriler localstorageda varmı diye kontrol ediyoruz.
        // Eğer yoksa, ürünleri API'den çekiyoruz. Eğer API'den veri çekme işlemi başarılı olursa, ürünleri localStorage'a kaydediyoruz.
        // Favoriler de aynı şekilde kontrol ediliyor. Eğer favoriler localStorage'da yoksa, boş bir dizi olarak başlatılıyor.
        // Son olarak, ürünleri ve favorileri kullanarak modülün işlevselliğini sağlıyoruz.

        // Modül yapılandırmasını yapıyoruz.
        console.log("Initializing module:", ModuleConfiguration.ModuleName);

        // Hedef URL kontrolü yapıyoruz.
        if (!targetUrlCheck()) {
            return;
        }

        // Ürünleri localStorage'dan yüklüyoruz.
        if (!loadProductsFromStorage()) {
            products = await fetchProducts();
            if (products && products.length > 0 && Array.isArray(products)) {
                localStorage.setItem(ModuleConfiguration.ModuleProductStorageKey, JSON.stringify(products));
                console.log("Products fetched from API and saved to localStorage:", products);
            } else {
                console.error("No products fetched from API.");
                return;
            }
        } else {
            console.log("Products loaded from localStorage successfully.");
        }

        // Favorileri localStorage'dan yüklüyoruz.
        if (favorites.length === 0) {
            console.log("No favorites found in localStorage, initializing with an empty array.");
            favorites = [];
        } else {
            console.log("Favorites loaded from localStorage:", favorites);
        }

        // Websitesindeki stories kısmının altına eklememiz gerektiği için ilk olarak bu kısmı buluyoruz.
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

        if (!document.querySelector('.carousel')) {
            storiesSection.insertAdjacentElement('afterend', carousel); // afterend ile stories bölümünün altına ekliyoruz.
        }

        console.log("Module initialized successfully. Products and favorites are ready to use.");

    }

    init().then(() => {
        console.log("Module initialized with configuration:", ModuleConfiguration);
    }).catch((error) => {
        console.error("Error initializing module:", error);
    });



})();