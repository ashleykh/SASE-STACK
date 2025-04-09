// Sample information to display
var info = {
  'ding tea': {'wintermelon milk tea': {rating: 5, review: 'good'}, 'peach oolong tea': {rating: 4, review: 'good'}},
  'boba tea': {'mango milk tea': {rating: 5, review: 'good'}}
};

var currentCategory; // Default category
var categoryNames = []; // Array to store category names


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



// --- NEW CODE: Run this when the DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
  for (const categoryName in info) {
    populateInitialCategoryNames(categoryName) // Add category names to the list
  }
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
});

// Close/Hide the modal when the close button (×) is clicked
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close/Hide the modal if the user clicks outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
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

  console.log('New Entry Added:', { title, review, rating }); // Logs the data/send to database

  // Clear the form fields
  entryForm.reset();

  // Reset image preview
  imagePreview.style.backgroundImage = '';

  // Reset rating stars
  ratingStars.forEach(star => star.classList.remove('active'));

  // Close the modal
  modal.style.display = 'none';

});


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
  
}

function displayContent(category) {
  const contentBox = document.
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
