daysList = document.getElementById('daysList');
monthName = document.getElementById('monthName');

document.getElementById('getDaysBtn').addEventListener('click', () => {

  fetch('/tpt/createraces', {method: 'POST'})
    .then(response => response.json())
    .then(data => {

      monthName.textContent = data.month;

      daysList.innerHTML = ''; // clear

      for (const day in data.days) {
        const li = document.createElement('li');
        li.textContent = day;
        daysList.appendChild(li);
      }

      document.getElementById('specialDays').style.display = 'block';

    });

});

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