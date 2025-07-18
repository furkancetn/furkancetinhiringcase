(function() {

    const ModuleConfiguration = {
        ModuleName: "FURKAN_ÇETİN",
        ModuleVersion: "1.0.0",
        ModuleDescription: "A module for managing products and favorites for recommendation system.",
        ModuleAuthor: "Furkan Çetin",
        ModuleFavoriteStorageKey: "favorites",
        ModuleProductStorageKey: "products",
        ModuleProductAPIURL: "https://api.example.com/products",
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



    }

    init().then(() => {
        console.log("Module initialized with configuration:", ModuleConfiguration);
    }).catch((error) => {
        console.error("Error initializing module:", error);
    });



})();