function toggleMenu() {
    document.getElementById("dropdownItems").classList.toggle("show");
  }
  
  // click outside of menu closes it
  window.onclick = function(event) {
    if (!event.target.matches('.dropdownNavToggle')) {
      let items = document.getElementsByClassName("dropdownItems");
      let i;
      for (i = 0; i < items.length; i++) {
        let openDropdown = items[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}
  