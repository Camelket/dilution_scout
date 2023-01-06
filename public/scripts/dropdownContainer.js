let classListCacheContainerElement = {}
let classListCacheControlElement = {}
let containerItemIdControlItemIdMap = {}

let controlItemContainerFunctionsMap = {}
let controlItemContainerMap = new Map()
let controlItemIdRegistry = new Set()
let controlItemIdToggleStateMap = new Map()


let controlItemOnToggle = {}
function registerToggleFuncOnControlItem(controlItemId, onToggleFunc) {
    controlItemOnToggle[controlItemId] = onToggleFunc
    // register an anon function in a map to access in toggleByControlItem
}

// let accordionSymbols = []

function toggleAccordionSymbolCollapsed(controlItemId, containerId, toggleOnClass, toggleOffClass) {
    return () => {
        const container = document.getElementById(containerId);
        // container.innerHTML = "&#8853;";
        container.innerHTML = " &#9660;";  
    };
};
function toggleAccordionSymbolExtended(controlItemId, containerId, toggleOnClass, toggleOffClass) {
    return () => {
        const container = document.getElementById(containerId);
        // container.innerHTML = "&#8861;";
        container.innerHTML = " &#9650;";
    };
};


function makeContainerToggleableByControlItem(controlItemId, containerId, containerToggleOnFunc="none", containerToggleOffFunc="none", startOn=true, toggleOnClass=null, toggleOffClass=null, callToggleFuncInitally=true) {
    // toggleFunc: func(controlItemId, containerItemId, toggleOnClass, toggleOffClass) {}
    let container = document.getElementById(containerId)
    let controlItem = document.getElementById(controlItemId)
    // give the start state of the containerItem
    // startOn = true -> we call the toggleOffFunc when we toggle the first time
    // startOn = false -> we call the toggleOnFunc when we toggle the first time
    if (!controlItemIdToggleStateMap.has(controlItemId)) {
        controlItemIdToggleStateMap.set(controlItemId, startOn)
    }
    const nullFunc = () => {console.log("nullFunc called")};
    if (containerToggleOnFunc == "none") {
        containerToggleOnFunc = nullFunc;
    }
    if (containerToggleOffFunc == "none") {
        containerToggleOffFunc = nullFunc;
    }
    if (callToggleFuncInitally == true) {
        if (startOn == true) {
            containerToggleOffFunc()
        } else {
            containerToggleOnFunc()
        }
    }
    if (!controlItemContainerFunctionsMap[controlItemId]) {
        controlItemContainerFunctionsMap[controlItemId] = []
    } 
    let containerToggleFunc = () => {
        let currentToggleState = controlItemIdToggleStateMap.get(controlItemId);
        if (currentToggleState == true) {
            containerToggleOnFunc()
        }
        if (currentToggleState == false){
            containerToggleOffFunc()
        }
    }
    controlItemContainerFunctionsMap[controlItemId].push(containerToggleFunc)
    if (!controlItemIdRegistry.has(controlItemId)) {
        controlItem.addEventListener('click',  function(){toggleByControlItem(controlItemId);})
        controlItemIdRegistry.add(controlItemId)
    }
}

function registerContainerIdForControlItemId(controlItemId, containerId) {
    if (!controlItemContainerMap.has(controlItemId)) {
        controlItemContainerMap.set(controlItemId, [])
    }
    let containerIdArray = controlItemContainerMap.get(controlItemId)
    if (!containerIdArray.includes(containerId)) {
        containerIdArray.push(containerId)
        controlItemContainerMap.set(controlItemId, containerIdArray)
    }
}

function makeContainerFoldableByControlItem(controlItemId, containerId, startOpen=true, foldedClassName="isFoldedUpControlItem", foldUpClass="foldUpContainerItem", foldDownClass="foldDownContainerItem") {
    let container = document.getElementById(containerId)
    let controlItem = document.getElementById(controlItemId)
    registerContainerIdForControlItemId(controlItemId, containerId)
    if (startOpen != true) {
        if (!controlItem.classList.contains(foldedClassName)) {
            controlItem.classList.add(foldedClassName)
        }
        if (!container.classList.contains(foldUpClass)) {
            container.classList.add(foldUpClass)
        }
    } else {
        if (!container.classList.contains(foldDownClass)) {
            container.classList.add(foldDownClass)
        }
    }
    if (!containerItemIdControlItemIdMap[containerId]) {containerItemIdControlItemIdMap[containerId] = controlItemId}
    if (!controlItemContainerFunctionsMap[controlItemId]) {
        controlItemContainerFunctionsMap[controlItemId] = []
    } 
    controlItemContainerFunctionsMap[controlItemId].push(foldContainer(containerId, foldUpClass, foldDownClass))
    if (!controlItemIdRegistry.has(controlItemId)) {
        controlItem.addEventListener('click',  function(){toggleByControlItem(controlItemId);})
        controlItemIdRegistry.add(controlItemId)
    }
}


function toggleByControlItem(controlItemId) {
    let controlItem = document.getElementById(controlItemId);
    let containerFunctions = controlItemContainerFunctionsMap[controlItemId];
    for (let idx in containerFunctions) {
        containerFunctions[idx]();
    }
    if (!controlItemOnToggle[controlItemId]) {
        controlItem.classList.toggle("fallbackOnToggleClass")
    } else {
        controlItemOnToggle[controlItemId]();
    }
    let containerIds = controlItemContainerMap.get(controlItemId)
    // currently this disallows for any animation since the item is hidden right away
    // but it seems like a good compromise for the lower complexity
    for (let idx in containerIds) {
        let containerId = containerIds[idx]
        let container = document.getElementById(containerId)
        container.classList.toggle("hidden")
    }
    if (controlItemIdToggleStateMap.get(controlItemId) == true) {
        controlItemIdToggleStateMap.set(controlItemId, false)
    } else {
        controlItemIdToggleStateMap.set(controlItemId, true)
    }
}


function foldContainer(containerId, foldUpClass, foldDownClass) {
    return () => {
        let container = document.getElementById(containerId);
        if (!container.classList.contains(foldUpClass) && !container.classList.contains(foldDownClass)) {
            console.log("WARNING: folding classes werent added correctly to container before calling toggleContainer, currently present classes on container: ", container.classList)
        }
        if (container.classList.contains(foldUpClass)) {
            container.classList.remove(foldUpClass)
            container.classList.add(foldDownClass)
        } else {
            container.classList.remove(foldDownClass)
            container.classList.add(foldUpClass)
        }
    };
}
