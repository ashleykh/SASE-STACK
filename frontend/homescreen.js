// Data structure (info object)
var info = {
    'ding tea': 
    {
      'wintermelon milk tea': { rating: 5, review: 'good', image: '../images/yiyi.jpg' },
      'peach oolong tea': { rating: 4, review: 'good', image: '../images/yiyi.jpg' }
    },
    'boba tea': 
    {
      'mango milk tea': { rating: 5, review: 'good', image: '../images/yiyi.jpg' }
    }
  };
  
  var best = {
    'bestest': 
    {
      'yiyi': { rating: 5, review: 'should be a mandatory viewing every 5 years, so much to learn from this.it’s impossible to see everything this has to offer off a single viewing so it only makes...', image: '../images/yiyi.jpg' }
    }
  };

  var stats = {
    total_category: 4,
    recent_creation: 7,
    average_rating: 3.7,
    total_entries: 54
  };
  
  const descriptions = {
    recent_creation: "new entries this month",
    total_category: "lists made in lifetime",
    average_rating: "average rating",
    total_entries: "total entries made"
  };


  // Function to display an individual item
  function displayItemInfo(title, rating, review, image, contentBox)
   {
    // Create the entry div (wrapper for the whole item)
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';
  
    // Create image element (if no image, set default)
    const entryImg = document.createElement('img');
    entryImg.className = 'entry-img';
    if (image) 
    {
      entryImg.src = image;
      entryImg.alt = title; // Set alt text to the title if image exists
    } 
    else 
    {
      entryImg.src = ''; // No image case, it can display a placeholder or nothing
      entryImg.alt = 'No image available'; // Optional: alternative text for accessibility
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
  
    for (const category in best) 
    {
      const categoryInfo = best[category];
  
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
  
    for (const key in descriptions) {
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
  
  populateContent();
  
  populateBest();
  
  populateStats();
