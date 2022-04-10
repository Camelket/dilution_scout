(function () {
    let items = document.getElementsByClassName("filingTableRow")
    for (let i=0; i < items.length; i++){
        let item = items[i]
        item.addEventListener("mouseenter", function(){
            let rowItems = item.childNodes
            for (let i=0; i < rowItems.length; i++){
                let rowItem = rowItems[i]
                if (rowItem.classList.contains("filingTableItem")){
                    // toggle the class that holds the transition declaration then
                    // toggle the class that holds the new property value to be transitioned into
                    rowItem.classList.toggle("hoverRowSetup")
                    rowItem.classList.toggle("hoverRowActivator")
                }
            }
            })
        
        item.addEventListener("mouseleave", function() {
            let rowItems = item.childNodes
            for (let i=0; i < rowItems.length; i++){
                let rowItem = rowItems[i]
                if (rowItem.classList.contains("filingTableItem")){
                    rowItem.classList.toggle("hoverRowSetup")
                    rowItem.classList.toggle("hoverRowActivator")
                }
            }
            })
        }
    
    })()


// css
// .hoverRowSetup {
//   /* background-color: black; */
//   transition: background-color 0.3s linear;
// }

// .hoverRowActivator {
//   background-color: black;
// }