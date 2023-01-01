function makeContainerToggleable(controlItemId, containerId) {
    let container = document.getElementById(containerId)
    // first hide the container if it isnt already
    if (!container.classList.contains("hidden")) {
        container.classList.toggle("hidden")
    }
    // remove is-open if present on container
    if (container.classList.contains("is-open")) {
        container.classList.toggle("is-open")
    }
    let controlItem = document.getElementById(controlItemId)
    controlItem.addEventListener('click',  function(){toggleContainer(containerId);})
}

function toggleContainer(containerId) {
    let container = document.getElementById(containerId)
    container.classList.toggle("hidden")
    container.classList.toggle("show")
}


  