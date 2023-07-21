
const hamBurger = document.querySelector(".hamBurger");
const mainMenu = document.querySelector(".mainMenu");

hamBurger.addEventListener('click', () => {
    hamBurger.classList.toggle("active");
    mainMenu.classList.toggle("active");
})

document.querySelectorAll(".menuLinks").forEach(n => n. addEventListener ("click", () => {
    hamBurger.classList.remove("active")
    mainMenu.classList.remove("active")
}))



//AUTO TYPING
    var typed = new Typed(".auto-type", {
        strings : [ "", "A website developer", "A Frontend developer", "A Wordpress Expert", "A website designer", "A webflow Expert"],
        typeSpeed : 150,
        backSpeed : 150,
        loop: true,
        });

//BACK TO TOP
window.addEventListener("scroll", function(){
    var scroll = document.querySelector(".scrollTo");
    scroll.classList.toggle("active", window.scrollY > 500)
})

// function scrollToTop(){
//     window.scrollTo(0, 0);
// }




//Quotes Popup

const formOpenBtn = selectElement("#freequotes");
const formCloseBtn = selectElement("#close");
const searchContainer = selectElement("#formPop");

// Open/Close search form popup
formOpenBtn.addEventListener('click', () => searchContainer.classList.add('activated'));
formCloseBtn.addEventListener('click', () => searchContainer.classList.remove('activated'));
// -- Close the search form popup on ESC keypress
window.addEventListener('keyup', (event) => {
    if(event.key === 'Escape') searchContainer.classList.remove('activated');
});


//ANIMATION SCROLL IN

// scrollOut({
//     targets: "h1, p, h2, h4, hr, a, img, div"
// })


//ANOTHER ANIMATION SCROLL

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        } else {
            entry.target.classList.remove("active");
        }
    });
});
const hiddenElements = document.querySelectorAll("h2, h3, p, a, hr, img");
hiddenElements.forEach((el) => observer.observe(el));