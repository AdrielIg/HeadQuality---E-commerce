const navMobile = document.querySelector(".mobile-nav");
const burger = document.querySelector(".burger");
const links = navMobile.querySelectorAll("a");
//Animations scroll function
let screenPosition = window.innerHeight / 1.6;

function scrollAppear1(){
    let productText1 = document.querySelector(".product-text-1");
    let productPosition1 = productText1.getBoundingClientRect().top;

    if (productPosition1 < screenPosition){
        productText1.classList.add("product-text-scroll");
    }
}
function scrollAppear2(){
    const productText2 = document.querySelector(".product-text-right-1");
    const productPosition2 = productText2.getBoundingClientRect().top;

    if (productPosition2 < screenPosition){
        productText2.classList.add("product-text-scroll");
    }
}
function scrollAppear3(){
    let productText3 = document.querySelector(".product-text-3");
    let productPosition3 = productText3.getBoundingClientRect().top;

    if (productPosition3 < screenPosition){
        productText3.classList.add("product-text-scroll");
    }
}
function scrollAppear4(){
    let productText4 = document.querySelector(".product-text-right-2");
    let productPosition4 = productText4.getBoundingClientRect().top;

    if (productPosition4 < screenPosition){
        productText4.classList.add("product-text-scroll");
    }
}

window.addEventListener("scroll", scrollAppear1); 
window.addEventListener("scroll", scrollAppear2); 
window.addEventListener("scroll", scrollAppear3); 
window.addEventListener("scroll", scrollAppear4); 

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