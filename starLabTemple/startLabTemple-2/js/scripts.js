import { temples } from '../data/temples.js'
//console.log(temples)

import { url } from '../data/temples.js'
//console.log(url)

const showHere = document.querySelector("#showHere")
const mydialog = document.querySelector('#mydialog')
const mytitle = document.querySelector('#mydialog h2')
const myinfo = document.querySelector('#mydialog p')
const myclose = document.querySelector('#mydialog button')
myclose.addEventListener("click", () => mydialog.close())

// loop through the array of json items
function displayItems(data) {
    console.log(data)
    data.forEach(x => {
        console.log(x)
        const photo = document.createElement('img')
        photo.src = `${url}${x.path}`
        photo.alt = x.name
        //add an event listner to each division on the page
        photo.addEventListener('click', () => showStuff(x));
        showHere.appendChild(photo)
    })

}

//Start displaying all items in the json file
displayItems(temples)



//populate the dialog with info when image is clicked
function showStuff(x) {
    mytitle.innerHTML = x.name
    myinfo.innerHTML = `Dedicated: ${x.dedicated} <br> Dedicated by: ${x.person}`
    mydialog.showModal()
}