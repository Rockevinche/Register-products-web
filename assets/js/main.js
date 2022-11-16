const products = JSON.parse(localStorage.getItem("products")) || []; //Obtener productos del localStorage

//Obtener elementos del DOM
const formulario = document.querySelector(".register-form");
const search = document.querySelector(".search-form");

window.onload = () => {
    renderProducts(products); //Cargar productos al inicio
}

// Manejo de eventos

formulario.addEventListener("submit", (event)=>{ // Capturar datos del formulario de registro de productos
    event.preventDefault();

    const formData = new FormData(formulario);
    let sku = formData.get("sku");
    let name = formData.get("name");
    let brand = formData.get("brand");
    let category = formData.get("category");
    let price = Number(formData.get("price"));
    let image = formData.get("image");

    if(products.filter(product => product.sku.toLowerCase() === sku.toLowerCase()).length){ // Validando que el SKU sea unico usando truthy y falsy
        showWarning("El SKU del producto ya existe");
        return;
    }

    if(isNaN(price) || price <= 0){ // Validando que el precio sea solamente numeros positivos
        showWarning("El precio ingresado es inválido");
        return;
    }

    let product = {sku: sku, name: name, brand: brand, category: category, price: price, image: image};

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products)); // Guardar productos en el localStorage

    formulario.reset(); // Limpiar formulario

    renderProducts(products); // Actualizar vista de productos
});

search.addEventListener("submit", (event)=>{ // Capturar datos del formulario de busqueda de productos
    event.preventDefault();

    const formData = new FormData(search);
    let filter = formData.get("filter");
    let searchValue = formData.get("search");

    let filteredProducts = searchFilter(filter, searchValue); // Filtrar productos

    renderProducts(filteredProducts); // Actualizar vista de productos
});

// Funciones logicas

const showWarning = (message) => {
    const warning = document.querySelector(".alert-message");

    warning.innerHTML = message;
    warning.style.opacity = 100; // Mostrar mensaje de alerta

    setTimeout(()=>{ // Ocultar mensaje de alerta
        warning.style.opacity = 0;
    }, 3000);
}

const renderProducts = (products) => {
    const productList = document.querySelector(".product-list");

    if(products.length === 0){ // Validar que existan productos
        productList.innerHTML = `<h2>No hay productos registrados</h2>`;
        return;
    }

    let html = products.reduce((html, product)=>{ // Crear HTML de productos
        return html + `
        <article class="product">
        <div class="product-image-container">
            <img src="${product.image}" alt="Product-image" onerror="this.onerror=null;
            this.src='https://raw.githubusercontent.com/Rockevinche/Images/27c2c2a75092a6d16c402aa28daf407e7df32583/Programaci%C3%B3n%20Web/Segundo%20Parcial/Logo.svg'">
        </div>
        <div class="info-container">
            <h3>${product.name}</h3>
            <p><span>Marca: </span>${product.brand}</p>
            <p><span>Categoria: </span>${product.category}</p>
            <p><span>Precio: </span>$${product.price}</p>
            <p><span>SKU: </span>${product.sku}</p>
        </div>
        </article>
        \n`;
    }
    , "");

    productList.innerHTML = html; // Insertar HTML en el DOM
}

const searchFilter = (filter, searchValue)=>{ // Filtrar productos
    switch(filter){
        case "sku":
            return products.filter(product => product.sku.toLowerCase().includes(searchValue.toLowerCase())); 
        case "name":
            return products.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
        case "brand":
            return products.filter(product => product.brand.toLowerCase().includes(searchValue.toLowerCase()));
        case "category":
            return products.filter(product => product.category.toLowerCase().includes(searchValue.toLowerCase()));
        case "price":
            return products.filter(product => product.price.toString().includes(searchValue));
        default:
            return products.filter(product =>{ 
                return (product.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.category.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.price.toString().includes(searchValue));
            });
}};