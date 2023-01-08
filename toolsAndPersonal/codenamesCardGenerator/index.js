var textarea = document.querySelector('textarea');
(textarea.oninput = function() {
  textarea.style.height = 0;
  textarea.style.height = textarea.scrollHeight + 'px';
})();

var inputbutton = document.querySelector('.button');
let cardContainer = document.querySelector('.card-container')
let baseCard = document.querySelector('#basis-card');
inputbutton.addEventListener("click", (event)=>{
    let stringsToIterate = textarea.value.split("\n")
    for (let i = 0; i < stringsToIterate.length; i++) {
        let curText = stringsToIterate[i]
        let newCard = baseCard.cloneNode(true)
        
        newCard.querySelector("#lower-text-container").innerText = curText;
        newCard.querySelector("#upper-text-container").innerText = curText;
        cardContainer.appendChild(newCard)
    } 

    let mainPageCont = document.querySelector(".main-page-container")
    mainPageCont.style.display = "none"

    print()
}); 