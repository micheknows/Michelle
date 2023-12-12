document.addEventListener('DOMContentLoaded', () => {

daysList = document.getElementById('daysList');

monthName = document.getElementById('monthName');


document.getElementById('getDaysBtn').addEventListener('click', () => {

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

      updateDaysList(data.days);
    });

});




export function updateDaysList(days) {
  daysList = document.getElementById('daysList');
  daysList.innerHTML = '';

  for (const day in days) {
    const li = document.createElement('li');
    li.textContent = day;
    daysList.appendChild(li);
  }

}

daysList = document.getElementById('daysList');

// Edit day
daysList.addEventListener('click', (e) => {
  if(e.target.tagName == 'LI') {

    let day = e.target.textContent;

    e.target.innerHTML = `
      <input type="text" value="${day}" id="editInput">
      <button onclick="saveEdit('${day}', this)">Save Edit</button>
    `;

    document.getElementById("editInput").focus();

  }
});

function saveEdit(oldDay, el) {

  const newDay = el.previousElementSibling.value;

  el.parentElement.innerHTML = newDay;

}


// Delete day
daysList.addEventListener('click', (e) => {

  if(e.target.className == 'deleteBtn') {

    const day = e.target.previousElementSibling.textContent;

    e.target.parentElement.remove();

  }

});


// Add day
document.getElementById('addDayBtn').addEventListener('click', () => {

  const day = prompt('Enter special day:');

  const li = document.createElement('li');
  li.textContent = day;

  daysList.appendChild(li);

});

});