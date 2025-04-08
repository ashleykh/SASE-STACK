// Get DOM elements
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
  modal.style.display = 'block';
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

function addCategoryName() {
  const categoryBox = document.getElementById("buttonList");
  // Create new category box
  const button = document.createElement("button");
  button.className = "category-name-btn";
  button.innerText = "Double Click to Edit";
  button.ondblclick = function(){categoryInput(button);}
  categoryBox.appendChild(button);
}

function categoryInput(button) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = button.innerText;
  input.className = "category-name-btn-input";

  // Turn input to button when done editing
  input.onblur = function(){convertToButton(input);}
  input.onkeydown = function(event) {
    if(event.key === "Enter") {
      convertToButton(input);
    }
  };

  // Put in category name 
  button.replaceWith(input);
  input.focus();
}

function convertToButton(input) {
  const button = document.createElement("button");
  button.className = "category-name-btn";
  button.innerText = input.value.trim() || "Double Click to Edit";
  button.ondblclick = function(){categoryInput(button);};

    // Put button with category name
  input.replaceWith(button);
}