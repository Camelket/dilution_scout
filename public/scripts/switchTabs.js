function openTab(event, tabId){
    let tab, tabs, selectionTabs;

    tabs = document.getElementsByClassName("tabContent");
    for (let i=0; i < tabs.length; i++){
        tabs[i].classList.add("inactiveTab")
        tabs[i].classList.remove("activeTab")
    }

    selectionTabs = document.getElementsByClassName("selectionTab")
    for (let i=0; i < selectionTabs.length; i++) {
        selectionTabs[i].classList.remove("activeSelectionTab")
    }

    tab = document.getElementById(tabId)
    tab.classList.remove("inactiveTab")
    tab.classList.add("activeTab")
    event.currentTarget.classList.add("activeSelectionTab")
}