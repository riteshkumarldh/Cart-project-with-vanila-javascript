const cartContainer = document.querySelector("[data-cart-container]");
const cartBtn = document.querySelector("[cart-toggle]");
const closeCartBtn = document.querySelector("[data-close]");
const overlay = document.querySelector(".overlay");
const productContainer = document.querySelector("[data-products]");
const cartProducts = document.querySelector("[data-cart-products]");
const headerCartCount = document.querySelector(".cart-count");
const cartQty = document.querySelector(".cartQty");
const cartTotal = document.querySelector(".cartTotal");


/**
 * toggling cart container
 */
cartBtn.addEventListener("click", () => {
    cartContainer.classList.toggle("active");
    overlay.classList.toggle("active")

});

overlay.addEventListener("click", () => {
    cartContainer.classList.remove("active");
    overlay.classList.remove("active");
});

closeCartBtn.addEventListener("click", () => {
    cartBtn.click();
});


/**
 * function calling on page load
 */
window.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    showCartProducts();
});


let allProductsData;
// fetching data from api url: https://fakestoreapi.com/products
function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        showProducts(data);
        allProductsData = data;
    })
    .catch((error) => {
        alert("Network or live server issue", error)
    })
}


/**
 * showing products in the html document
 */
function showProducts(products) {
    let productList = "";
    products.forEach((product) => {
        productList += `
        <div class="product">
            <figure><img src="${product.image}" alt="${product.title}"></figure>
            <p class="product-title">${product.title}</p>
            <div class="price-btn">
                <span class="price">$${product.price.toFixed()}</span>
                <button onclick="addIntoCart(${product.id})">Add to cart</button>
            </div>
        </div>`;
    });
    productContainer.innerHTML = productList;
}

/**
 * initially allproducts is empty array but as we add any item in cart then we get those item from localstorage
 */
let allProducts = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];


function addIntoCart(itemID) {
    let itemAlreadyInCart = false;

    // if product already in localstorage and his id match with clicked addtocart product id then we show the alert
    allProducts.forEach((localStorageProduct) => {
        if(localStorageProduct.id === itemID){
            alert("Item already available in cart");
            itemAlreadyInCart = true;
        }
    });

    // if product not in localstorage simply we push that product in array
    if(!itemAlreadyInCart) {
        allProductsData.forEach((product) => {
            if(product.id === itemID){
                allProducts.push(product);
            }
        });
    }

    // adding cart quantity property in added cart
    allProducts.forEach((localStorageProduct) => {
        if(!localStorageProduct.quantity){
            localStorageProduct.quantity = 1;
        }
    });

    // console.log(allProducts);


    // setting added product in localstorage
    localStorage.setItem("items" , JSON.stringify(allProducts));

    showCartProducts();    
}



/**
 * show added cart products in cart container. we show localstorage stored cart items
 */
function showCartProducts(){
    let total = 0;
    let cartItem = "";
    allProducts.forEach((product) => {
        cartItem += `
            <div class="cart-item">
                <figure class="cart-img">
                    <img src="${product.image}" alt="product">
                </figure>
                <div class="cart-item-details">
                    <p class="cart-item-title">${product.title}</p>
                    <div class="action">
                        <div class="inc-dec">
                            <button class="dec" onclick="decreaseQuantity(${product.id})">-</button>
                            <input type="number" id="cart-item-qty" value="${product.quantity}" readonly>
                            <button class="inc" onclick="increaseQuantity(${product.id})">+</button>
                        </div>
                        <span class="material-symbols-outlined" onclick="deleteProduct(${product.id})">
                            delete
                        </span>
                    </div>
                    <div class="price-detials">
                        <div class="item-price"><strong>Price: </strong>$${(product.price).toFixed()}</div>
                        
                    </div>
                </div>
            </div>
        `;
        total += product.quantity;
    });

    // showing total cart quantity
    headerCartCount.textContent = total;
    cartQty.innerHTML = `<b>Total Qty: </b> ${total}`;
    
    cartProducts.innerHTML = cartItem;
    
    calculateQuantityTotal();  
}

// function for increasing the cart quantity
function increaseQuantity(id){

    allProducts.forEach((pro) => {
        if(pro.id === id){
            pro.quantity++;
        }
    })

    // setting added product in localstorage
    localStorage.setItem("items" , JSON.stringify(allProducts));
    showCartProducts();

}

// function for decaresing the cart quantity
function decreaseQuantity(id){
    
    allProducts.forEach((pro) => {
        if(pro.id === id){
            if(pro.quantity > 1){
                pro.quantity--;
            }
        }
    })

    // setting added product in localstorage
    localStorage.setItem("items" , JSON.stringify(allProducts));
    showCartProducts();
    
}

// function for deleting the product from cart
function deleteProduct(proId){
    allProducts = allProducts.filter((product) => {
        if(product.id !== proId){
            return product;
        }
    });

    // setting added product in localstorage
    localStorage.setItem("items" , JSON.stringify(allProducts));

    // updating cartitems after deleting
    showCartProducts();
}


// updating the cart total
function calculateQuantityTotal (){
    
    let totals = allProducts.reduce((acc, cur) => {
        return acc += cur.quantity * cur.price.toFixed();
    }, 0)

    cartTotal.innerHTML = `<b>Cart Total: </b> $${totals}`;

}

// clear all btn functionality
const clearAll = document.querySelector(".clear-all");
clearAll.addEventListener("click", () => {
    allProducts.splice(0);
    showCartProducts();
    // setting added product in localstorage
    localStorage.setItem("items" , JSON.stringify(allProducts));
});

// checkout btn functionality
const CheckOut = document.querySelector(".Check-out");
CheckOut.addEventListener("click", () => {
    alert("This page is currently not available");
});

