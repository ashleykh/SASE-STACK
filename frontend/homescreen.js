// Data structure (info object)

//import { recent } from './dashboard.js';
let recent = 0

// var info = {
//   'ding tea': {'wintermelon milk tea': {rating: 2, review: 'goodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgood', image: ''}, 'peach oolong tea': {rating: 4, review: 'good', image: ''}, 'peacah oolong tea': {rating: 4, review: 'good', image: ''}, 'peachd oolong tea': {rating: 4, review: 'good', image: ''}, 'peach oodlong tea': {rating: 4, review: 'good', image: ''}},
//   'boba tea': {'mango milk tea': {rating: 5, review: 'good', image: ''}}
// };

var info = {}


var highlight = 
{
    'best': {}
};

var stats = 
{
    totalCategory: 0, //get total catagories
    recentCreation: 0, //get how many items they created
    averageRating: 0, // get average ratings
    totalEntries: 0 // get how many entries there are
};

const descriptions = 
{
    recent_creation: "new entries this month",
    total_category: "lists made in lifetime",
    average_rating: "average rating",
    total_entries: "total entries made"
};

function computeStats(info) 
{
    let totalEntries = 0;
    let totalRating = 0;
    let recentEntries = recent;

    const seenCategories = new Set();

    for (const category in info) 
    {
        seenCategories.add(category);
        for (const item in info[category]) 
        {
            totalEntries++;
            totalRating += info[category][item].rating;
        }
    }

    const averageRating = totalEntries > 0 ? (totalRating / totalEntries).toFixed(1) : 0;

    // add recent entries here

    return {
        total_category: seenCategories.size,
        recent_creation: recentEntries,
        average_rating: parseFloat(averageRating),
        total_entries: totalEntries
    };
}

function gatherHighlights(info, highlight)
{
    for (const category in info)
    {
        for(const item in info[category])
        {
            if(info[category][item].rating  >= 4)
            {
                highlight.best[item] = info[category][item];
            }
        }
    }
}

function populateInitialCategoryNames(name) {
    const categoryBox = document.getElementById("buttonList");
    const input = document.createElement("input");
    input.className = "category-name-btn-input";
    input.type = "text";
   
    input.value = name;
    input.dataset.originalValue = input.value;
    categoryBox.appendChild(input);
  
  
    // Turn input to button when done editing
    input.onblur = function(){closeCategoryNameInput(input);};
    input.ondblclick = function(){openCategoryNameInput(input);};
    input.onclick = function(){selectCategoryNameInput(input);};
    input.onkeydown = function(event) {
      if(event.key === "Enter") {
        input.blur(); // Better to blur than just set readOnly
      }
    };
  }

// Function to display an individual item
function displayItemInfo(title, rating, review, image, contentBox)
{
    // Create the entry div (wrapper for the whole item)
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';

    // Create image element (if no image, set default)
    const entryImg = document.createElement('img');
    entryImg.className = 'entry-img';
    if (image) {
        entryImg.src = image;
        entryImg.alt = title;
    } else {
        entryImg.style.backgroundColor = 'black'; // black box fallback
        entryImg.style.width = '100px'; // or whatever your image size is
        entryImg.style.height = '100px';
        entryImg.style.display = 'inline-block'; // makes it behave like an image
    }

    // Create the content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'entry-content';

    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'title';
    titleEl.textContent = title;

    // Rating
    const ratingEl = document.createElement('div');
    ratingEl.className = 'rating';
    ratingEl.textContent = '★★★★★'.slice(0, rating); // Display stars according to rating

    // Info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    const reviewEl = document.createElement('p');
    reviewEl.className = 'review';
    reviewEl.textContent = review;

    // Append rating and review to the info section
    infoDiv.appendChild(ratingEl);
    infoDiv.appendChild(reviewEl);

    // Append title and info to the content wrapper
    contentWrapper.appendChild(titleEl);
    contentWrapper.appendChild(infoDiv);

    // Append the image and content to the entry div
    entryDiv.appendChild(entryImg);
    entryDiv.appendChild(contentWrapper);

    // Add the entry div to the passed contentBox
    contentBox.appendChild(entryDiv);
}


// Function to populate the content dynamically for 'info'
function populateContent() 
{
    // Find the content-wrapper inside box-recent
    const contentBox = document.querySelector('.box-recent .content-wrapper');

    // Loop through the categories in 'info'
    for (const category in info) 
    {
        const categoryInfo = info[category];

        // Loop through the items in each category
        for (const item in categoryInfo) 
        {
            const { rating, review, image } = categoryInfo[item];
            // Use the same displayItemInfo function to create the entries
            displayItemInfo(item, rating, review, image, contentBox); // Passing the contentBox of box-recent
        }      
    }
}

// Function to populate the content dynamically for 'best'
function populateBest() 
{
    // Find the content-wrapper inside box-lead
    const contentBox = document.querySelector('.box-lead .content-wrapper');

    for (const category in highlight) 
    {
        const categoryInfo = highlight[category];

        // Loop through the items in the category
        for (const item in categoryInfo) 
        {
        const { rating, review, image } = categoryInfo[item];

        // Use the same displayItemInfo function to create the entries
        displayItemInfo(item, rating, review, image, contentBox); // Passing the contentBox of box-lead
        }
    }
}

function populateStats() 
{
    const statsBox = document.querySelector('.box-stats'); // Make sure this exists in HTML

    for (const key in descriptions) 
    {
        const p = document.createElement('p');
        p.classList.add('stat');

        const span = document.createElement('span');
        span.classList.add('number');
        span.textContent = stats[key];

        p.appendChild(span);
        p.append(` ${descriptions[key]}`);

        statsBox.appendChild(p);
    }
}

async function getInfo(user_id) {
    try {
      const response = await fetch('http://127.0.0.1:5000/user-info', {
        method: 'GET',
        headers: {
            'userid': user_id
        }
      });
    
      const result = await response.json()
    
      if (result.status === 'success') {
        return result.info
      } else {
          console.log('Error:', result.message);
      }
  
    } catch(error) {
        console.error('Error:', error);
    };
  }


document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userid');
    info = await getInfo(userId); // info is populated from Flask here

    
        // Save default to Flask
        try {
            await fetch('http://127.0.0.1:5000/add-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId,
                    category: 'Default Category'
                })
            });
        } catch (err) {
            console.error('Failed to save default category to backend:', err);
        }

    // Now compute and render
    stats = computeStats(info);
    gatherHighlights(info, highlight);
    populateContent();
    populateBest();
    populateStats();

    for (const categoryName in info) {
        populateInitialCategoryNames(categoryName);
    }

    openFirstCategory();
});

// stats = computeStats(info);
// gatherHighlights(info, highlight);
// populateContent();
// populateBest();
// populateStats();