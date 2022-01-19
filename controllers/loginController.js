counter = function(){
	let count = 0;
	return {
		increment: () => count = count+1,
		decrement: () => count = count-1,
		value: () => count
	}
}

c = counter()

let incrementButton = document.querySelector("#b1");
let decrementButton = document.querySelector("#b2");

function replaceCounterValue() {
	let counterValue = c.value()
	let s = `Current Value of Counter: ${counterValue}`
	let oldVal = document.querySelector("#counter")
	let newVal = document.createElement("p")
	newVal.id = "counter"
	newVal.append(document.createTextNode(s))
	if (oldVal) {
		oldVal.replaceWith(newVal)
	} else {
		let main = document.querySelector("main")
		main.append(newVal)
	}
}

incrementButton.addEventListener('click', function() {
	c.increment();
	replaceCounterValue();	
	});

decrementButton.addEventListener('click', function() {
	c.decrement();
	replaceCounterValue();
	});
