// Get DOM elements
const modal = document.getElementById('myModal');
const entryButton = document.querySelector('.catagory-btn'); // Entry button
const closeModalBtn = document.querySelector('.close');
const entryForm = document.getElementById('entryForm');
const imagePreview = document.querySelector('.image-preview');
const imageInput = document.getElementById('imageInput');
const ratingStars = document.querySelectorAll('.rating-star');

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