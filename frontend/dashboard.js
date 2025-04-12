// Sample information to display
// var info = {
//   'ding tea': {'wintermelon milk tea': {rating: 2, review: 'good', image: ''}, 'peach oolong tea': {rating: 4, review: 'good', image: ''}, 'peacah oolong tea': {rating: 4, review: 'good', image: ''}, 'peachd oolong tea': {rating: 4, review: 'good', image: ''}, 'peach oodlong tea': {rating: 4, review: 'good', image: ''}},
//   'boba tea': {'mango milk tea': {rating: 5, review: 'good', image: ''}}
// };

// var info = getInfo(localStorage.getItem('userid'))

var info = {}

var currentCategory; // Default category
var categoryNames = []; // Array to store category names
var uploadedImageDataURL = ''; // Image URL to Upload
let editingEntryTitle = null; // Track which entry is being edited 


// Get DOM (Document Object Model) elements
const modal = document.getElementById('myModal');
const entryButton = document.querySelector('.category-btn'); // Entry button
const closeModalBtn = document.querySelector('.close');
const entryForm = document.getElementById('entryForm');
const imagePreview = document.querySelector('.image-preview');
const imageInput = document.getElementById('imageInput');
const ratingStars = document.querySelectorAll('.rating-star');
const pullout = document.querySelector('.menu-icon');
const categoryBox = document.querySelector('.box-category');
const search = document.querySelector(".category-search")
const sortInput = document.querySelector('input[list="sort-options"]');
const entryCard = document.querySelector('.box-list-content');

// --- NEW CODE: Run this when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {

  info = await getInfo(localStorage.getItem('userid'))

  console.log(info)

  for (const categoryName in info) {
    console.log(categoryName)
    populateInitialCategoryNames(categoryName) // Add category names to the list
  }
  openFirstCategory();

});

// close or pull out category list after clicking menu icon
pullout.addEventListener('click', () =>
  {
    categoryBox.classList.toggle('show');
    const boxList = document.querySelector('.box-list');
    if (categoryBox.classList.contains('show')) {
      boxList.style.transition = 'none';
      boxList.style.width = '100%';
    } else {
      boxList.style.transition = 'right 0.7s ease-in-out, width 0.7s ease-in-out'; // Add transition effect
      boxList.style.width = '70%'; // Reset to original width
    }
  });

// Open the modal when the + Entry button is clicked
entryButton.addEventListener('click', () => {
  modal.style.display = 'flex';
  editingEntryTitle = null;
  entryForm.reset();
  imagePreview.style.backgroundImage= '';
  ratingStars.forEach(star => star.classList.remove('active'));
});

// Close/Hide the modal when the close button (×) is clicked
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  entryForm.reset();
  editingEntryTitle = null;
});

// Close/Hide the modal if the user clicks outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    entryForm.reset();
    editingEntryTitle = null;
  }
});

// Sort-by function
sortInput.addEventListener('input', () => {
  const sortBy = sortInput.value.toLowerCase();

  if (!currentCategory || !(currentCategory in info)) return;

  const entries = Object.entries(info[currentCategory]);

  // Perform sorting
  if (sortBy === 'rating(descending)') {
    entries.sort((a, b) => b[1].rating - a[1].rating); // Descending
  } if (sortBy === 'rating(ascending)') {
    entries.sort((a, b) => a[1].rating - b[1].rating); // Ascending
  } else if (sortBy === 'name(a-z)') {
    entries.sort((a, b) => a[0].localeCompare(b[0])); // A-Z
  }else if (sortBy === 'name(z-a)') {
    entries.sort((a, b) => b[0].localeCompare(a[0])); // Z-A
  }//dates

  // Clear and display sorted entries
  const contentBox = document.querySelector('.box-list-content');
  contentBox.innerHTML = '';
  for (const [title, data] of entries) {
    displayItemInfo(title, data.rating, data.review, data.image);
  }
});

// Upload image
function openFilePicker() {
  imageInput.click();  // Triggers file input
}

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader(); // Reads the file
    reader.onload = (e) => {
      uploadedImageDataURL = e.target.result; // <--- Save the image data
      imagePreview.style.backgroundImage = `url(${e.target.result})`; // Sets the preview image
      imagePreview.style.backgroundSize = 'cover';
      imagePreview.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file); // Converts the file to a data URL
  }
});

// Record rating stars
ratingStars.forEach((star, index) => {
  star.addEventListener('click', () => {
    const rating = index + 1; // Calculates ratings
    ratingStars.forEach((s, i) => {
      s.classList.toggle('active', i < rating); // Activates/deactivates stars
    });
  });
});

// Record form submission
entryForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get form values
  const title = document.getElementById('title').value;
  const review = document.getElementById('review').value;
  const rating = Array.from(ratingStars).filter(star => star.classList.contains('active')).length;

  // Check if a category is selected
  if (!currentCategory) {
    alert('Please select a category first!');
    return;
  }

  // Initialize category if it doesn't exist in info
  if (!info[currentCategory]) {
    info[currentCategory] = {};
  }

  // If editing and title changes delete the old title
  if (editingEntryTitle && editingEntryTitle != title) {
    delete info[currentCategory][editingEntryTitle];
  }

  // Add the new entry with its title, rating, and review
  info[currentCategory][title] = {
    rating: rating,
    review: review,
    image: uploadedImageDataURL
  };

  console.log('New Entry Added:', { category: currentCategory, title, rating, review, image: uploadedImageDataURL });

  // Clear the form fields
  entryForm.reset();

  // Reset image preview
  imagePreview.style.backgroundImage = '';
  uploadedImageDataURL = '';

  // Reset rating stars
  ratingStars.forEach(star => star.classList.remove('active'));

  // Close the modal
  modal.style.display = 'none';

  // Change edit status to null
  editingEntryTitle = null;

  displayContent(currentCategory);
});

function openFirstCategory() {
  const allInputs = document.querySelectorAll('.category-name-btn-input');
  const firstCategoryName = Object.keys(info)[0];

  if (firstCategoryName in info && allInputs.length > 0) {
    currentCategory = firstCategoryName;

    // Clear active-category from all buttons first
    allInputs.forEach(input => input.classList.remove('active-category'));

    // Find the input whose value matches the first category name
    const firstInput = Array.from(allInputs).find(input => input.value === firstCategoryName);
    if (firstInput) {
      firstInput.classList.add('active-category'); // highlight the first one
    }

    displayContent(currentCategory);
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

function addCategoryName(name = "cat") {
    const categoryBox = document.getElementById("buttonList");
    const input = document.createElement("input");
    input.className = "category-name-btn-input";
    input.type = "text";
   
    // Handle duplicate names at creation time
    let uniqueName = name;
    if(uniqueName in info) {
      let i = 1;
      while ((uniqueName + " (" + i + ")") in info) {
        i++;
      }
      uniqueName = name + " (" + i + ")";
    }
   
    input.value = uniqueName;
    info[uniqueName] = {}; // Initialize as empty object
    input.dataset.originalValue = uniqueName; // Store the original value
   
    addCategoryToDatabase(localStorage.getItem('userid'), uniqueName)

    categoryBox.appendChild(input);
    input.select();

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

function selectCategoryNameInput(input) {
  // Remove active-category class from all inputs
  const allInputs = document.querySelectorAll('.category-name-btn-input');
  allInputs.forEach(item => {
    item.classList.remove('active-category');
  });
 
  // Add active-category class to the clicked input
  input.classList.add('active-category');
  currentCategory = input.value;
  displayContent(input.value); // Display the content of the selected category
 
}

function displayContent(category) {
  const contentBox = document.querySelector('.box-list-content');
  contentBox.textContent = '';
  // Recieves all content from category
  for (const item in info[category]) {
    const { rating, review, image } = info[category][item];

    displayItemInfo(item,rating,review, image) // Add in picture data!
  }
}

function displayItemInfo(title, rating, review, image) {
  const contentBox = document.querySelector('.box-list-content');
  const imageDiv = document.createElement('div');
  imageDiv.className = 'entry-img';

  if (image) {
    // Normalize the path (replace backslashes with forward slashes)
    const imagePath = image.replace(/\\/g, '/');

    // Replace grey background with image using background-image
    imageDiv.style.backgroundImage = `url('${imagePath}')`;
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.style.backgroundColor = 'transparent'; // Remove the grey
  }

  const allDiv = document.createElement('div');
  allDiv.className = 'entry-all';

  // Create entry card
  const entryDiv = document.createElement('div');
  entryDiv.className = 'entry-card';

  // Trash icon on entry card
  const trashIcon = document.createElement('img');
  trashIcon.src = '/images/trash_icon.png';
  trashIcon.className = 'trash-icon';
  trashIcon.title = 'Delete Entry'
  // Allow the trash icon to be clicked to delete the card
  trashIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if(confirm(`Are you sure you want to delete "${title}"?`)) {
      delete info[currentCategory][title]; // Remove from data
      allDiv.remove(); // Remove from DOM
    }
  });

  // Append trash icon to entry div
  entryDiv.appendChild(trashIcon);

  // Info container
  const infoDiv = document.createElement('div');
  infoDiv.className = 'entry-info';

  // Title
  const titleEl = document.createElement('h4');
  titleEl.className = 'entry-title';
  titleEl.textContent = title;

  // Star rating
  const stars = document.createElement('div');
  stars.className = 'entry-stars';
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    star.textContent = '★';
    if (i < rating) {
      star.style.color = '#3498db'; // Highlighted star
    } else {
      star.style.color = '#ccc'; // Unhighlighted star
    }
    star.style.fontSize = '24px';
    stars.appendChild(star);
  }

  // Review
  const reviewEl = document.createElement('p');
  reviewEl.className = 'entry-review';
  reviewEl.textContent = review;

  // Assemble and append
  infoDiv.appendChild(titleEl);
  infoDiv.appendChild(stars);
  infoDiv.appendChild(reviewEl);
  entryDiv.appendChild(infoDiv);
  allDiv.appendChild(entryDiv);
  allDiv.appendChild(imageDiv);

  // Make entry clickable to edit
  allDiv.addEventListener('click', () => {
    editingEntryTitle = title;
    document.getElementById('title').value = title;
    document.getElementById('review').value = review;
    ratingStars.forEach((star, i) => {
      star.classList.toggle('active', i < rating);
    });
    if (image) {
      uploadedImageDataURL = image;
      imagePreview.style.backgroundImage = `url('${image}')`;
      imagePreview.style.backgroundSize = 'cover';
      imagePreview.style.backgroundPosition = 'center';
    } else {
      imagePreview.style.backgroundImage = '';
    }
    modal.style.display = 'flex';
  });

  contentBox.appendChild(allDiv);
}


function openCategoryNameInput(input) {
  input.readOnly = false;
  input.dataset.originalValue = input.value; // Store current value before editing
  input.focus();
  input.select();
  input.classList.add("active"); // Add active class for styling
}

function closeCategoryNameInput(input) {

  const originalValue = input.dataset.originalValue;
 
  // If the value didn't change, do nothing to the object
  if(input.value === originalValue) {
    input.readOnly = true;
    console.log(info);
    return;
  }
 
  // If new value already exists in info (but isn't the current one)
  if(input.value in info) {
    let i = 1;
    while ((input.value + " (" + i + ")") in info) {
      i++;
    }
    input.value = input.value + " (" + i + ")";
  }
 
  // If original value exists in info, rename the key
  if(originalValue in info) {
    // Save the contents
    const contents = info[originalValue];
    // Delete the old key
    delete info[originalValue];
    // Create new key with the same contents
    info[input.value] = contents;
  } else {
    // This normally shouldn't happen, but add it as a fallback
    info[input.value] = {};
  }


  input.dataset.originalValue = input.value; // Update the stored value
  input.readOnly = true;
  console.log(info);
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

function addCategoryToDatabase(user_id, category_name) {

  fetch('http://127.0.0.1:5000/add-category', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      'user_id': user_id,
      'category_name': category_name
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      console.log('category added')
    } else {
      console.log('error category not added')
    }
  })
  .catch(error=>{
    console.log(error)
  })
}