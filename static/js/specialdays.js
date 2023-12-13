let days = [];
let titles = [];

// Get the titles when the get titles button is clicked
    document.getElementById('genTitlesBtn').addEventListener('click', () => {
        var titlesTab = document.getElementById('titles-tab');

        // Get the selected value of month and grade level
        var selectedMonth = monthSelect.options[monthSelect.selectedIndex].value;
        var selectedGradeLevel = gradeLevelSelect.options[gradeLevelSelect.selectedIndex].value;
        var specialDaysList = document.getElementById('daysList').innerText;


        // Let's run the python module to grab the titles'
         fetch('/api/titles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            month: selectedMonth,
            grade: selectedGradeLevel,
              days: specialDaysList
          })
        })
            .then(response => response.json())
            .catch(err => {
              console.log(err)
              alert('Error parsing JSON' + err)
            })
            .then(data => {
                alert("data is " + data);
              titles = [];

                // Iterate over the data array and push each title
                data['titles'].forEach(title => {
                    titles.push(title);
                });
              updateList(titles,"titleList");
            });

        // Activate the Titles tab
        new bootstrap.Tab(titlesTab).show();
    });


// Get the special days when the get special days button is clicked
document.getElementById('getDaysBtn').addEventListener('click', () => {

        // Get the selected value of month and grade level
        var selectedMonth = monthSelect.options[monthSelect.selectedIndex].value;
        var selectedGradeLevel = gradeLevelSelect.options[gradeLevelSelect.selectedIndex].value;

        // Set the innerHTML of the target elements with the selected values
        document.getElementById('monthNametitles').innerHTML = selectedMonth;
        document.getElementById('gradeleveltitles').innerHTML = selectedGradeLevel;

        // Let's run the python module to grab the special days'
         fetch('/api/specialdays', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            month: selectedMonth,
            grade: selectedGradeLevel
          })
        })
            .then(response => response.json())
            .catch(err => {
              console.log(err)
              alert('Error parsing JSON' + err)
            })
            .then(data => {
              days = [];

                for (let k in data) {
                  days.push(k + ": " + data[k]);
                }
              updateList(days,"daysList");
            });
          });

  // Add a special day to the list manually
  document.getElementById('addDayBtn').addEventListener('click', () => {
    const day = prompt('Enter special day:');
    days.push(day);
      updateList(days, "daysList");
  });


  // Edit a day that already exists
        // Get modal element
        let selectedLi;
        const modal = document.getElementById('dayModal');

        daysList.addEventListener('click', (e) => {

          // Get clicked li
          const li = e.target.tagName === 'LI' ? e.target : e.target.parentElement;

          // Set selected day
          selectedLi = li;

          // Show modal
          modal.style.display = 'block';

          // Set modal data from li
          document.getElementById('modalDayName').innerText = li.innerText;

        });



        // Save changes and close modal
        document.getElementById('saveBtn').addEventListener('click', () => {

          // Get updated value
          const updatedDay = document.getElementById('modalDay').value;

          // Update selected li
          selectedLi.innerText = updatedDay;
           // Get index of selected li
          const index = [...daysList.children].indexOf(selectedLi);

          // Update days array
          days[index] = updatedDay;
          updateList(days,'daysList')
          document.getElementById('modalDay').value="";

          // Hide modal
          modal.style.display = 'none';

        });


        // Delete day and close modal
        document.getElementById('delBtn').addEventListener('click', () => {

            // Get index
              const index = [...daysList.children].indexOf(selectedLi);

              // Remove from list
              daysList.removeChild(selectedLi);

              // Remove from array
              days.splice(index, 1);

              // Clear input
              document.getElementById('modalDay').value="";

              // Reset selected
              selectedLi = null;

          updateList(days,'daysList')
          document.getElementById('modalDay').value="";

          // Hide modal
          modal.style.display = 'none';

        });


        // Close modal without saving
        document.getElementById('closeBtn').addEventListener('click', () => {


          // Hide modal
          modal.style.display = 'none';
          document.getElementById('modalDay').value="";

        });


   // this will update any given list with the given contents
  function updateList(contents, listtoUpdate) {
      var mylist = document.getElementById(listtoUpdate)
    mylist.innerHTML = '';
        contents.forEach(content => {

          const li = document.createElement('li');
          li.textContent = content;

          mylist.appendChild(li);
        })
  };

