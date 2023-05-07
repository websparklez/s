
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




    var typed = new Typed(".auto-type", {
        strings : [ "", "A website developer", "A Frontend developer", "A Wordpress Expert", "A website designer", "A webflow Expert"],
        typeSpeed : 150,
        backSpeed : 150,
        loop: true,
        });


