// Create a new XHR
let xhr = new XMLHttpRequest();

// Set up the XHR callback
xhr.onreadystatechange = function() {
  // Check if the request is done (readyState 4) and if the status is 200 (successful)
  if (xhr.readyState == 4 && xhr.status == 200) {
    // Parse the JSON response
    let data = JSON.parse(xhr.responseText);

    // Call the function to add the RSS feed to the DOM
    addRSStoDOM(data);
  }
};

function addRSStoDOM(data) {
  // Create the 'outer' container to hold everything
  let itemsContainer = document.createElement('DIV');

  // for each item add a title, link, and description
  for (let i = 0, t = data.items.length; i < t; ++i) {
    let item = data.items[i];  // get the item
    // create a element to contain, title, link, description
    let itemContainer = document.createElement('DIV');

    // create and update the link element
    let itemLinkElement = document.createElement('A');
    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.innerText = item.title;

    // create and update the title (use link as title, so title is clickable)
    let itemTitleElement = document.createElement('H2');
    itemTitleElement.appendChild(itemLinkElement);

    // create and update the description.
    // TODO: make sure the content is XSS safe before using innerHTML
    let itemDescriptionElement = document.createElement('P');
    itemDescriptionElement.innerHTML = item.description;

    // elements have been updated, lets add each to the inner container
    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);

    // lets add the inner container to outer container
    itemsContainer.appendChild(itemContainer);
  }

  // So the RSS feed is complete, lets build a title RSS source
  let titleElement = document.createElement('H1');
  titleElement.innerText = data.feed.title;

  // We have the RSS titles, and a container of article summaries
  // lets add them to the main DOM.
  let main = document.querySelector('main');
  main.appendChild(titleElement);
  main.appendChild(itemsContainer);
}

// The following gets the ADD RSS button to work.  This is a very similar
// process that we did in the ToDo application.  Find the elements in
// the HTML, then write a function to handle the element/event, then add
// the event listener.
let addFeedButton = document.getElementById("add-feed");
let newRSSInput = document.getElementById("rss-input");

/* Every time we add a task, save the task to local storage */
function onAddRSSClicked(event) {
  let URL = newRSSInput.value;
  newRSSInput.value = "";

  // CORS proxy
  const corsProxy = 'https://cors-everywhere.herokuapp.com/';
  const rss2jsonAPI = 'https://api.rss2json.com/v1/api.json?rss_url=';

  // Create and send a GET request
  // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
  // The second argument is the endpoint URL
  xhr.open('GET', corsProxy + rss2jsonAPI + encodeURIComponent(URL));
  xhr.send();
}

addFeedButton.addEventListener('click', onAddRSSClicked);
