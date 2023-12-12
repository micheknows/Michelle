let daysList;
let monthName;
let gradelevel;

// Ensure that specialdays is a property of the window object and not overwritten elsewhere
window.specialdays = window.specialdays || {};
window.saveEditBtn = window.saveEditBtn || {};

document.addEventListener('DOMContentLoaded', () => {

  daysList = document.getElementById('daysList');
  monthName = document.getElementById('monthName');
  gradelevel = document.getElementById('gradelevel');


  document.getElementById('getDaysBtn').addEventListener('click', () => {



        var gradeLevelSelect = document.getElementById('gradeLevel');
        var titlesTab = document.getElementById('titles-tab');

        // Get the selected value of month and grade level
        var selectedMonth = monthSelect.options[monthSelect.selectedIndex].value;
        var selectedGradeLevel = gradeLevelSelect.options[gradeLevelSelect.selectedIndex].value;

        // Set the innerHTML of the target elements with the selected values
        document.getElementById('monthNametitles').innerHTML = selectedMonth;
        document.getElementById('gradeleveltitles').innerHTML = selectedGradeLevel;

            fetch('/api/specialdays', {
      method: 'POST'
    })
    .then(response => response.json())
    .catch(err => {
      console.log(err)
      alert('Error parsing JSON' + err)
    })
    .then(data => {
      // Display data
      monthName.textContent = data.month;
      window.specialdays.updateDaysList(data.days);
    });
  });

  // Define the updateDaysList function as a method of specialdays
  window.specialdays.updateDaysList = function(days, listtoUpdate) {
    listtoUpdate.innerHTML = '';

    for (const day in days) {
      const li = document.createElement('li');
      li.textContent = `${day}`;
      listtoUpdate.appendChild(li);
    }
  };

  // Edit day
let selectedLi;

daysList.addEventListener('click', (e) => {

  let li = e.target;

  // Get <li> if child element clicked
  if(e.target.tagName !== 'LI') {
    li = e.target.parentElement;
  }

  if(selectedLi) {
    selectedLi.classList.remove('selected');
  }

  selectedLi = li;
  li.classList.add('selected');

});


window.saveEditBtn.saveEdit = function() {

  const newText = editInput.value;
  selectedLi.textContent = newText;

  // Reset edit view
  selectedLi.innerHTML = "";
  selectedLi.textContent = newText;

}

// Edit button click
editBtn.addEventListener('click', () => {

  if(!selectedLi) {
    return;
  }

  // Get current text
  const text = selectedLi.textContent;

  // Create edit view
  selectedLi.innerHTML = `
    <input type="text" id="editInput" value="${text}">
    <button onclick="window.saveEditBtn.saveEdit()">Save</button>
  `;

  document.getElementById("editInput").focus();

});




// Delete button click
delBtn.addEventListener('click', () => {

  if(!selectedLi) {
    return;
  }

  daysList.removeChild(selectedLi);

  // Reset selected
  selectedLi = null;

});



  // Add day
  document.getElementById('addDayBtn').addEventListener('click', () => {
    const day = prompt('Enter special day:');
    const li = document.createElement('li');
    li.textContent = day;
    daysList.appendChild(li);
  });

});
