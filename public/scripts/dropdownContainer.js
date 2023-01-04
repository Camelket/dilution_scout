let classListCacheContainerElement = {}
let classListCacheControlElement = {}
let containerItemIdControlItemIdMap = {}

let controlItemContainerFunctionsMap = {}
let controlItemIdRegistry = new Set()
let controlItemIdToggleStateMap = {}


let controlItemOnToggle = {}
function registerTogglableControlItem(controlItemId, onToggleFunc) {
    controlItemOnToggle[controlItemId] = onToggleFunc
    // register an anon function in a map to access in toggleByControlItem
}

//change default foldup, folddown classes to something without any effect
function toggleArrowOn(ControlItemId, containerId, toggleOnClass, toggleOffClass) {
    return (...args) => {
        let container = document.getElementById(containerId);
        container.innerHTML = "&#9660;";
        console.log("toggleArrowOn called")
    }
}
function toggleArrowOff(ControlItemId, containerId, toggleOnClass, toggleOffClass) {
    return (...args) => {
        let container = document.getElementById(containerId);
        container.innerHTML = "&#9650;";
        console.log("toggleArrowOff called")
    }
}
function makeContainerToggleableByControlItem(controlItemId, containerId, startOn=true, containerToggleOnFunc=null, containerToggleOffFunc=null, toggleOnClass=null, toggleOffClass=null, callToggleFuncInitally=true) {
    // toggleFunc: func(controlItemId, containerItemId, toggleOnClass, toggleOffClass) {}
    let container = document.getElementById(containerId)
    let controlItem = document.getElementById(controlItemId)
    // give the start state of the containerItem
    // startOn = true -> we call the toggleOffFunc when we toggle the first time
    // startOn = false -> we call the toggleOnFunc when we toggle the first time
    if (!controlItemIdToggleStateMap[controlItemId]) {controlItemIdToggleStateMap[controlItem] = startOn}
    nullFunc = (controlItemId, containerId, toggleOnClass, toggleOffClass) => {};
    if (containerToggleOnFunc == null) {
        containerToggleOnFunc = nullFunc;
    }
    if (containerToggleOffFunc == null) {
        containerToggleOffFunc = nullFunc;
    }
    if (callToggleFuncInitally == true) {
        if (startOn == true) {
            containerToggleOffFunc(controlItemId, containerId, toggleOnClass, toggleOffClass)()
        } else {
            containerToggleOnFunc(controlItemId, containerId, toggleOnClass, toggleOffClass)()
        }
    }
    if (!controlItemContainerFunctionsMap[controlItemId]) {
        controlItemContainerFunctionsMap[controlItemId] = []
    } 
    let containerToggleFunc = () => {
        console.log("containerToggleFunc called")
        let currentToggleState = controlItemIdToggleStateMap[controlItemId];
        if (currentToggleState == true) {
            containerToggleOffFunc(controlItemId, containerId, toggleOnClass, toggleOffClass)
        } else {
            containerToggleOnFunc(controlItemId, containerId, toggleOnClass, toggleOffClass)
        }
    }
    controlItemContainerFunctionsMap[controlItemId].push(containerToggleFunc)
    if (!controlItemIdRegistry.has(controlItemId)) {
        controlItem.addEventListener('click',  function(){toggleByControlItem(controlItemId, foldedClassName);})
        controlItemIdRegistry.add(controlItemId)
    }
}

function makeContainerFoldableByControlItem(controlItemId, containerId, startOpen=true, foldedClassName="isFoldedUpControlItem", foldUpClass="foldUpContainerItem", foldDownClass="foldDownContainerItem") {
    let container = document.getElementById(containerId)
    if (!classListCacheContainerElement[containerId]) {classListCacheContainerElement[containerId] = container.classList}
    let controlItem = document.getElementById(controlItemId)
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
    if (!classListCacheControlElement[controlItemId]) {classListCacheControlElement[controlItemId] = controlItem.classList}
    if (!containerItemIdControlItemIdMap[containerId]) {containerItemIdControlItemIdMap[containerId] = controlItemId}
    if (!controlItemContainerFunctionsMap[controlItemId]) {
        controlItemContainerFunctionsMap[controlItemId] = []
    } 
    controlItemContainerFunctionsMap[controlItemId].push(foldContainer(containerId, foldUpClass, foldDownClass))
    if (!controlItemIdRegistry.has(controlItemId)) {
        controlItem.addEventListener('click',  function(){toggleByControlItem(controlItemId, foldedClassName);})
        controlItemIdRegistry.add(controlItemId)
    }
}

function toggleByControlItem(controlItemId, toggledOnClassName) {
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
    if (controlItemIdToggleStateMap[controlItemId] == true) {
        controlItemIdToggleStateMap[controlItemId] = false
    } else {
        controlItemIdToggleStateMap[controlItemId] = true
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