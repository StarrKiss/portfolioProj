const $ = document.querySelector.bind(document);

let selector = $("#selector");
let selectorTwo = $("#selectortwo");
let navDropper = $("#nav-dropdown-more")
let navDropperIcon = $("#nav-dropped-icon")

const destinations = ["Nantar", "Mineyta", "Mezinta", "Briskton","Brisk","New Wye", "Briss", "Subtari", "Tanc-Maraj", "Maraj", "Amdri", "Brisan", "Jessin", "Dontal", "Ardinburg", "Jan", "Marisban", "Nurispol", "Nv. Prova", "Prova", "Nur. Drinsar", "Portland"]
const statusoptions = ["BOARDING", "LATE", "EARLY", "DEPARTED", "ON-TIME"]
const trainTypes = ["Regional", "Express", "Inter-city Express", "International", "Coastline", "Inter-city"]

let navDropOpen = false;


let departureList = []

function generateTrainLine(inputNode){
    const stationIndex = destinations.indexOf("New Wye")

    for(let i = 0; i<destinations.length; i++){
        let toAdd = document.createElement("div")
        toAdd.classList.add("line-circle")
        toAdd.dataset.stop = destinations[i]
        inputNode.append(toAdd)

        if(i!= destinations.length-1){
            let toLine = document.createElement("div")
        toLine.classList.add("line-line")

        
        inputNode.append(toLine)
        }
        
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  function addLeadingZeros(num, totalLength, val = '0') {
    return String(num).padStart(totalLength, val);
  }


  function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

function createInnerHtml(str, totalLength = -1){
    if(totalLength == -1){
        totalLength = str.length;
    }
    let ToReturn = ""
    if(str.length > totalLength){
        str = str.substring(0, totalLength-1)
        str += "."
    }
    if(str.length < totalLength){
        let toAdd = totalLength - str.length;
        for (let i = 0; i < toAdd; i++) {
            ToReturn +=  "<span class=\"singleDigit\">"
            ToReturn += "&nbsp;"
            ToReturn += "</span>";
        }
    }
    for (let i = 0; i < str.length; i++) {
        ToReturn +=  "<span class=\"singleDigit\">"
        if(str[i] == " "){
            ToReturn += "&nbsp;"
        }else{
            ToReturn += str[i];
        }
        
        ToReturn += "</span>";
    }

    return ToReturn;
}

function generateDepartures(){
    for(let i = 0; i < 50; i++){
        let newDeparture = {}
        newDeparture.time = addLeadingZeros(getRandomIntInclusive(1, 12), 2) + ":" + addLeadingZeros(getRandomIntInclusive(0, 59), 2)
        newDeparture.trainNum = addLeadingZeros(getRandomIntInclusive(0, 9999), 4, "0");
        newDeparture.platform = addLeadingZeros(getRandomIntInclusive(1, 22), 2, "0");
        newDeparture.destination = sample(destinations);
        newDeparture.leftFrom = sample(destinations);
        newDeparture.statusVal = sample(statusoptions);
        newDeparture.trainType = sample(trainTypes)

        newDeparture.depId = getRandomIntInclusive(1, 100000);

        departureList.push(newDeparture)
    }
    console.log(departureList)
}
function generateRows(depList){
    const firstNode = $("#singleRow")
    const parent = $("#tableBody")

    for(let i = 0; i < depList.length; i++){
        let toModify = firstNode.cloneNode(true);
        let time = depList[i].time;
        let timeNode = toModify.querySelector('.timeDisplay');

        let num = depList[i].trainNum;
        let numNode = toModify.querySelector('.numberDisplay');

        let platform = depList[i].platform
        let platformNode = toModify.querySelector('.platform');

        let destination = depList[i].destination;
        let destinationNode = toModify.querySelector('.destination')

        let statusval = depList[i].statusVal;
        let statusNode = toModify.querySelector('.status')


        statusNode.innerHTML = createInnerHtml(statusval, 8)
        statusNode.classList.remove('status-boarding')
        statusNode.classList.add('status-' + statusval.toLowerCase())
        destinationNode.innerHTML = createInnerHtml(destination, 9)
        platformNode.innerHTML = createInnerHtml(platform);
        numNode.innerHTML = createInnerHtml(num)
        timeNode.innerHTML = createInnerHtml(time.substring(0, 2), 2) + ":" + createInnerHtml(time.substring(3, 5), 2)
        toModify.dataset.index = i;

        parent.append(toModify)
        depList[i].assocNode = toModify;
    }
    firstNode.remove()
}

function removeNavDropper(){
    selector.classList.remove("selectorOpen")
    selectorTwo.classList.remove("selectorOpen")

    navDropperIcon.classList.remove("openIcon")
}


function activateNavDropper(){
    selector.classList.add("selectorOpen")
    selectorTwo.classList.add("selectorOpen")

    navDropperIcon.classList.add("openIcon")
}
function initMouseover(){
    const navParent = document.getElementById('navparent');

    var children = navParent.children;
    for (var i = 0; i < children.length; i++) {
        let tableChild = children[i];
        if(tableChild != selector && tableChild != selectorTwo){
        tableChild.addEventListener('mouseover', (event) => {
            if(tableChild != navDropper){
                navDropOpen = false;
                removeNavDropper()
            }
            selectingNav(tableChild)
        });
        tableChild.addEventListener('mouseleave', (event) => {
            if(!navDropOpen){
            resetSelectors()

            selector.style.left = -200 + "px";
            selector.style.width = 200 + "px"

            selectorTwo.style.left = -200 + "px";
            selectorTwo.style.width = 200 + "px"
            }
        });
        
    }

    }

    navDropper.addEventListener('mouseup', (event) => {
        navDropOpen = !navDropOpen;
        if(navDropOpen){
            activateNavDropper()
        }
        else{
            removeNavDropper()
        }
        console.log(navDropOpen)
    }) 
}


 
function createAutocomplete(node, list){
    let destParent = node.querySelector('.auto-container')
    let nodeList = []
    let textField = node.querySelector('.textarea')
    for(let i = 0; i<list.length; i++){
        let toAdd = document.createElement("div")
        toAdd.innerText = list[i]
        toAdd.setAttribute("tabindex", 0)
        toAdd.classList.add("completeDropDown")
        
        toAdd.addEventListener('keypress', (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                textField.value = toAdd.innerText
                textField.blur()
                toAdd.blur()
              }
        });

        toAdd.addEventListener('click', (event) => {
            textField.value = toAdd.innerText
                textField.blur()
                toAdd.blur()
        });


        destParent.append(toAdd)
        nodeList.push(toAdd)
        
    }

    textField.addEventListener('input', (event) => {
        let value = textField.value;
        
        for(let i = 0; i< nodeList.length; i++){
            let tempText = nodeList[i].innerText;
            if (tempText.substr(0, value.length).toUpperCase() == value.toUpperCase()) {

                nodeList[i].innerHTML = "<strong>" + tempText.substr(0, value.length) + "</strong>";
                nodeList[i].innerHTML += tempText.substr(value.length);
                destParent.removeChild(nodeList[i])
                destParent.prepend(nodeList[i])
            }
            nodeList[i].classList.remove("selected")
        }

        destParent.children[0].classList.add("selected")
    });

    textField.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
           
            event.preventDefault();
            textField.value = destParent.children[0].innerText;
            textField.blur()
          }
    });
    
}

function resetSelectors(){
    selectorTwo.style.backgroundColor = "rgb(255, 141, 79)"
    selector.style.backdropFilter = "invert(1)"
    selector.style.borderColor = "#025a89"
}

function selectingNav(node){
    selector.style.left = node.offsetLeft + "px";
    selector.style.width = node.offsetWidth + "px"

    selectorTwo.style.left = node.offsetLeft + "px";
    selectorTwo.style.width = node.offsetWidth + "px"
    
    if(node.classList.contains("nav-right")){
        selectorTwo.style.backgroundColor = "#f0f0e9"
        selector.style.backdropFilter = "invert(0)"
        selector.style.borderColor = "var(--border)"
    }else{
        resetSelectors()
    }
}

function createInput(node){
    let childs = node.children;
    for(let i = 0; i<childs.length; i++){
        let blah = childs[i]
        blah.addEventListener('keyup', (event) => {
            console.log(event.keycode)
            if (event.key === "Backspace") {
                childs[i].innerText = ""

                childs[i].blur()
                childs[i-1].focus()
                childs[i-1].setSelectionRange(childs[i-1].value.length, childs[i-1].value.length);

            }
            else if(/^[0-9]$/i.test(event.key)){
                childs[i].blur()
                childs[i+1].focus()
            }else{
                event.preventDefault()
            }
            
        });

    }
}

function generateDropdown(nodeInput){
    let children = nodeInput.children;
    let lastSelected = undefined;
    let indicator = nodeInput.querySelector(".indicator")
    let textToChange = nodeInput.querySelector("#inner-dropdown")
    for(let i =1; i< children.length; i++){
        let curChild = children[i]
        if(curChild != indicator){
        curChild.addEventListener('click', (event) =>{
            textToChange.innerText = curChild.innerText;
            curChild.classList.add("selected")
            if(lastSelected != undefined && lastSelected != curChild){
                lastSelected.classList.remove("selected")
                lastSelected = curChild;
            }else if(lastSelected == curChild){
                lastSelected = undefined;
                curChild.classList.remove("selected")
                textToChange.innerText = "N/A"
            }else{
                lastSelected = curChild;
            }
            
        });
    }
    }
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getTime(percentage){
    let toUse = percentage
    if(percentage > 50){
        toUse -=50;
    }

    let minutes = map_range(toUse, 0, 50, 0, 720);

    let hours = Math.floor(minutes/60);
    minutes = Math.floor(minutes)%60;

    if(hours == 0){
        hours = 12;
    }

    return addLeadingZeros(hours, 2) + ":" + addLeadingZeros(minutes, 2);

    
}

function getPercentage(maxWidth, place){
    return (100 * place) / maxWidth;
 
}
function generateTimeSlider(inputNode){
    let left_slider = inputNode.querySelector('.time-handle-left')
    let right_slider = inputNode.querySelector('.time-handle-right')

    let left_display = inputNode.querySelector('#time-display-left')
    let right_display = inputNode.querySelector('#time-display-right')

    let selectedSegment = inputNode.querySelector('.selectedSegment');

    let rangePos = inputNode.getBoundingClientRect().left;
    let rangePosMax = inputNode.getBoundingClientRect().width - 10;

    let left_isDragged = false;
    let right_isDragged = false;

    let leftPos = 0;
    let rightPos = rangePosMax;

    selectedSegment.style.left = leftPos + 10 + "px";
    selectedSegment.style.width = (rightPos - leftPos) - 10 + "px"

    window.addEventListener("resize", (event)=>{
        rangePos = inputNode.getBoundingClientRect().left;
        rangePosMax = inputNode.getBoundingClientRect().width - 10;
    });

    left_slider.addEventListener('mousedown', (event)=>{
        left_isDragged = true;
        left_slider.classList.add("heldDown")
        left_display.classList.add("heldDown")
    });

    right_slider.addEventListener('mousedown', (event)=>{
        right_isDragged = true;
        right_slider.classList.add("heldDown")
        right_display.classList.add("heldDown")
    });

    document.addEventListener('mouseup', (event)=>{
        left_isDragged = false;
        right_isDragged = false;
        left_slider.classList.remove("heldDown")
        right_slider.classList.remove("heldDown")

        left_display.classList.remove("heldDown")
        right_display.classList.remove("heldDown")
    });

    document.addEventListener('mousemove', (event)=>{
        if(left_isDragged){
            let tempPos = (event.clientX - rangePos);
            // left_slider.style.left = tempPos + "px"

            
            let toChangeVal = Math.min(rightPos -10, Math.max(tempPos, 0));
             left_slider.style.left = toChangeVal + "px"

             let rectWidth = left_display.getBoundingClientRect().width
            //  left_display.style.left = Math.min(rightPos - (rectWidth*2), toChangeVal) + "px"
             leftPos = toChangeVal

             let timeVal = getTime(getPercentage(rangePosMax-10, leftPos))
             timeVal = timeVal.replace(':', "<br>");

             left_display.innerHTML = timeVal;
             
        }

        if(right_isDragged){
            let tempPos = (event.clientX - rangePos);
            // left_slider.style.left = tempPos + "px"

 
            let toChangeVal = Math.min(rangePosMax, Math.max(tempPos, leftPos + 10));
             right_slider.style.left = toChangeVal + "px"

             let rectWidth = right_display.getBoundingClientRect().width
            //  right_display.style.left = Math.max(leftPos + rectWidth, toChangeVal - rectWidth) + "px"

             rightPos = toChangeVal;

             let timeVal = getTime(getPercentage(rangePosMax, rightPos))
             timeVal = timeVal.replace(':', "<br>");

             right_display.innerHTML = timeVal;
             
        }

        if(left_isDragged || right_isDragged){
            selectedSegment.style.left = leftPos + 10 + "px";
            selectedSegment.style.width = (rightPos - leftPos) - 10 + "px" 
        }
    })
}

function changeFadeFunction(inputBody, toIgnore, addOrRemove){
    let inputChildren = inputBody.children;
    for(let i =0; i< inputChildren.length; i++){
        if(inputChildren[i] != toIgnore){
            if(addOrRemove){
                inputChildren[i].classList.add("rowUnselected")
            }else{
                inputChildren[i].classList.remove("rowUnselected")
            }
            
        }
    }
}



function generateLineSelector(){
    let tableParent = $("#tableBody")
    let lineInfoContainer = $("#line-info-container");
    let lastRow = undefined;
    document.addEventListener('click', (event)=>{
        if(event.target.closest(".singleDep")){
            let targetRow = event.target.closest(".singleDep")
            if(lastRow == targetRow){
                lastRow = undefined;
                targetRow.classList.remove("rowSelected")
                changeFadeFunction(tableParent, targetRow, false)
                lineInfoContainer.classList.remove("opened")
            }else{
                if(lastRow != undefined){
                    lastRow.classList.remove("rowSelected")
                    lastRow.classList.add("rowUnselected")
                    targetRow.classList.remove("rowUnselected")
                }else{
                    changeFadeFunction(tableParent, targetRow, true)
                    lineInfoContainer.classList.add("opened")
                }
                lastRow = targetRow;
                targetRow.remove()
                tableParent.prepend(targetRow)
                targetRow.classList.add("rowSelected")
                window.scrollTo(0, 0);
            }
        }
    });
}




initMouseover()
generateDepartures()
generateRows(departureList)
createAutocomplete($("#toAutocomplete"), destinations)
createInput($("#train-num"))
generateDropdown($("#train-type"))
generateTimeSlider($("#time-slider"))
generateLineSelector()
generateTrainLine($("#graph-container"))



