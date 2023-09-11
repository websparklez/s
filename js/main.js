
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
    let typed = new Typed(".auto-type", {
        strings : [ "", "A website developer", "A Frontend developer", "A Wordpress Expert", "A website designer", "A webflow Expert"],
        typeSpeed : 150,
        backSpeed : 150,
        loop: true,
        });

//BACK TO TOP
window.addEventListener("scroll", function(){
    let scroll = document.querySelector(".scrollTo");
    scroll.classList.toggle("active", window.scrollY > 500)
})

const scrollTop = document.querySelector(".scrollTo")

//console.log(scrollTop)
scrollTop.addEventListener("click", scrollToTop)

function scrollToTop(){
    window.scroll(0, 0);
}



//Quotes Popup

const formOpenBtn = document.querySelector("#freequotes");
const  openForm= document.querySelector("#formPop");
const  closeForm= document.querySelector("#close");

formOpenBtn.addEventListener('click', showForm)
closeForm.addEventListener('click', removeForm)

function showForm() {
    openForm.classList.add("activated")
    hamBurger.classList.remove("active")
    mainMenu.classList.remove("active")
}
function removeForm() {
    openForm.classList.remove("activated")
}


//ANIMATION SCROLL IN

// scrollOut({
//     targets: "h1, p, h2, h4, hr, a, img, div"
// })


//ANOTHER ANIMATION SCROLL

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("scroll-animation");
        } else {
            entry.target.classList.remove("scroll-animation");
        }
    });
});
const hiddenElements = document.querySelectorAll("h2, h3, p, hr, img");
hiddenElements.forEach((el) => observer.observe(el));