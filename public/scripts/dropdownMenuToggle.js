let menu;
function toggleMenu() { 
    //- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown
    menu = document.getElementById("dropdownMedium").classList
    menu.toggle("hidden")
    let burger = document.getElementById("hamburger_all")
    burger.classList.toggle("is-open");

    // let burger = document.getElementById("hamburger_all").classList
    // burger.toggle("is_open")
    // }
    // menu.toggle("show")
}

window.onclick = function(event) {
if (!event.target.matches('.dropdownNavToggle')) {
    let items = document.getElementsByClassName("dropdownItems");
    for (let i = 0; i < items.length; i++) {
        let openDropdown = items[i];
        if (openDropdown.classList.contains("show")) {
        openDropdown.classList.toggle("hidden")
        openDropdown.classList.toggle("show")
        }
    }
    }
}
  