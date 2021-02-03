const navMobile = document.querySelector(".mobile-nav");
const burger = document.querySelector(".burger");
const links = navMobile.querySelectorAll("a");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const productsDOM= document.querySelector(".product-center");
//cart
let cart = [];
//buttons
let buttonsDOM = []

//getting the prodcuts
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image}
            })
            return products
        } catch (error) {
            console.log(error);
        }
    
    }
}
// display products
class UI{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <div class="product">
            <div class="product-header">
                <img src=${product.image} alt="product">
                <ul class="icons">
                    <span><i class="bx bx-heart"></i></span>
                    <span class="bx bx-shopping-bag bag-btn" data-id=${product.id}></span>
                    <span><i class="bx bx-search"></i></span>
                </ul>
            </div>
            <div class="product-footer">
                <a href="#">
                    <h3>${product.title}</h3>
                </a>
                <div class="rating">
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                </div>
                <h4 class="price">$${product.price}</h4>
            </div>
        </div>
            `
        });
        productsDOM.innerHTML = result;

    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.style.backgroundColor= "rgb(227, 94, 94)";
                button.style.pointerEvents = "none";
            }
           
            
            button.addEventListener("click", (event) => {
                event.target.style.backgroundColor = "rgb(227, 94, 94)";
                event.target.style.color = "#fff";
                event.target.style.cursor = "default";
                button.style.pointerEvents = "none";
                //get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1};
                
                //add product to the cart
                //[...cart] significa "todos los elementos de cart" y el ",cartItem" agrega este elemento a la variable cart
                cart = [...cart, cartItem];
                
                // save the cart in local storage
                Storage.saveCart(cart);
                //set cart values
                this.setCartValues(cart);

                //display cart item
                //cartItem es el item seleccionado a agregar al carrito
                this.addCartItem(cartItem);
                //show the cart when an item is added
                this.showCart();
                });
            

        });
        
    }
    setCartValues(cart){
        //Valor de todos los productos en el cart
        let tempTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount;
        })
        cartTotal.innerText  = parseFloat(tempTotal.toFixed(2));
        
    }
    addCartItem(item){
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class='bx bxs-chevron-up' data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class='bx bxs-chevron-down' data-id=${item.id}></i>
        </div>`
        cartContent.appendChild(div);
        
    }

    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    setupAPP(){
        //carga datos del carrito si quedaron de una sesion anterior
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart)
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
        
    }
    //esta funcion muestra los items del local storage en el carrito
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item))
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
        
    }

    //En este caso "this.clearCart" se refiere al boton "clearCartBtn"
    /* cartLogic(){
        clearCartBtn.addEventListener("click", this.clearCart);
    } */

    //Y en este caso hace referencia la clase UI
    cartLogic(){
        //clear cart btn
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });
        //funcioladidad del carrito pa
        //Remover elementos del carrito de forma individual
        cartContent.addEventListener("click", (event) => {
            if(event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            //Aumentar la cantidad del elemento
            else if (event.target.classList.contains("bxs-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains("bxs-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0){
                    Storage.saveCart(cart)
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }

            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        //Aca habria que volver a poner el span con color normal, pero me tira error al hacerlo so lo dejo asi xd
        button.style = "";
        button.style.pointerEvents = "auto ";
        
        
    }
    getSingleButton(id){
        
        return buttonsDOM.find(button => button.dataset.id === id);

    }
    
}





//local storage

class Storage{
    //Static function/method works outside the class. Si lo quiero usar dentro de otra clase debo llamar la clase y luego la funcion ejemplo:(Storage.getProduct)
    static saveProduct(products){
        localStorage.setItem("products", JSON.stringify(products));
    } 
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
        
    }
    //Loading items in the local storage to the cart everytime we load the page
    static getCart(){
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    }
}

document.addEventListener("DOMContentLoaded", () =>{
const ui = new UI();
const products = new Products();
//setup app
ui.setupAPP();
//get all products
products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProduct(products);
}).then(() => {
    ui.getBagButtons()
    ui.cartLogic()
});

});


burger.addEventListener("click", () => {
    burger.classList.toggle("toggle");
    navMobile.classList.toggle("nav-open");
    document.body.classList.toggle("hide");
});

links.forEach(link => {
    link.addEventListener("click", () => {
        burger.classList.toggle("toggle");
    navMobile.classList.toggle("nav-open");
    document.body.classList.toggle("hide");
    })
});

