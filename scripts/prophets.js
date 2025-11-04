const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const card = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets);
    displayProphets(data.prophets);
}

getProphetData();

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create elements to add to the div.cards element
        let card = document.createElement('section');
        let fullName = document.createElement('h2'); //fill in the blank
        let portrait = document.createElement('img');
        let birthInfo = document.createElement('p'); 

        //Build the h2 content out to show the prophet's full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`//fill in the blank
        //Birth Info
        birthInfo.innerHTML = `
        <strong>Date of Birth:</strong> ${prophet.birthdate}<br>
        <strong>Place of Birth:</strong> ${prophet.birthplace}
    `;
        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`); // fill in the blank
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

    // Append the section(card) with the created elements
    card.appendChild(fullName); //fill in the blank
    card.appendChild(birthInfo);  
    card.appendChild(portrait);
        
    
        

    cards.appendChild(card);
  }); // end of arrow function and forEach loop
}

