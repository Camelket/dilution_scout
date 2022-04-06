(function descriptionTooltip() {
    let items = document.getElementsByClassName("filingDescription")
    for (let i=0; i < items.length; i++){
        let item = items[i]
        item.addEventListener("mouseenter", function(event) {
            let target = event.target
            if (checkOverflow(target)){
                let p = document.createElement("div")
                p.classList.add("filingTooltipShown")
                let text = target.innerText
                p.innerText = text
                item.appendChild(p)
                return
            } 
        })
        item.addEventListener("mouseleave", function(event) {
            let items = document.getElementsByClassName("filingTooltipShown")
            // if (event.target.parentNode)
            for (let i = 0; i < items.length; i++) {
                items[i].remove()
            return
            }
        })
    }
})()

// copied from https://stackoverflow.com/questions/143815/determine-if-an-html-elements-content-overflows
function checkOverflow(el)
{
   var curOverflow = el.style.overflow;

   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   var isOverflowing = el.clientWidth < el.scrollWidth 
      || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
}