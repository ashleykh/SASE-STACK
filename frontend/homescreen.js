// Data structure (info object)

//import { recent } from './dashboard.js';
let recent = 0

// var info = 
// {
//     'ding tea': 
//     {
//         'wintermelon milk tea': { rating: 5, review: 'good', image: '../images/yiyi.jpg' },
//         'peach oolong tea': { rating: 4, review: 'good', image: '../images/yiyi.jpg' }
//     },
//     'boba tea': 
//     {
//         'mango milk tea': { rating: 5, review: 'good', image: '../images/yiyi.jpg' }
//     }
// };

var info = {};

window.onload = async function() {
    info = await getInfo(localStorage.getItem('userid'))
    console.log(info)
};

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

function displayItemInfo(title, rating, review, image, contentBox) {
    // Create the entry div (wrapper for the whole item)
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';

    entryDiv.style.marginBottom = '15px'; // Space between entries
    entryDiv.style.borderBottom = '1px #e0e0e0'; // Optional divider line
    entryDiv.style.paddingBottom = '15px'; // Space before the divider
    entryDiv.style.marginRight = '10px'; // Add right margin to separate from scrollbar
  
    // Create image div
    const imageDiv = document.createElement('div');
    imageDiv.className = 'entry-img';
  
    if (image) {
      // Normalize the path (replace backslashes with forward slashes)
      const imagePath = image.replace(/\\/g, '/');
  
      // Set background image
      imageDiv.style.backgroundImage = `url('${imagePath}')`;
      imageDiv.style.backgroundSize = 'cover';
      imageDiv.style.backgroundPosition = 'center';
      imageDiv.style.backgroundColor = 'transparent';
      imageDiv.style.width = '150px';
      imageDiv.style.height = '200px';
    }
  
    // Create the content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'entry-content';
  
    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'title';
    titleEl.textContent = title;
  
    // Star rating
    const stars = document.createElement('div');
    stars.className = 'rating';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      if (i < rating) {
        star.style.color = '#3498db'; // Highlighted star
      } else {
        star.style.color = '#ccc'; // Unhighlighted star
      }
      stars.appendChild(star);
    }
  
    // Review
    const reviewEl = document.createElement('p');
    reviewEl.className = 'review';
    reviewEl.textContent = review;
  
    // Append components to the content wrapper
    contentWrapper.appendChild(titleEl);
    contentWrapper.appendChild(stars);
    contentWrapper.appendChild(reviewEl);
  
    // Append the image and content to the entry div
    entryDiv.appendChild(imageDiv);
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

stats = computeStats(info);

gatherHighlights(info, highlight);

populateContent();

populateBest();

populateStats();
