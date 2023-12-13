let days = [];
let titles = [];
let stories = [];
let storyIndex = 0;


// next story button
document.getElementById('nextstory').addEventListener('click', () => {
    storyIndex++;
    if(storyIndex  >= stories.length) {
        storyIndex = 0;
    }
    displayStory(storyIndex);
})

// previous story button
document.getElementById('prevstory').addEventListener('click', () => {
    storyIndex--;
    if(storyIndex  < 0) {
        storyIndex = stories.length-1;
    }
    displayStory(storyIndex);
})


// get stories when getStoriesBtn is clicked
document.getElementById('getStoriesBtn').addEventListener('click', () => {
        var storiesTab = document.getElementById('stories-tab');

        // Now get each story one at the time based on the titles
        // stories has to be set up like this
            //  stories = [['title':'My Title', 'question':'My Question', 'story': 'Story text', 'bwimage': image, 'colorimage': image, 'vocabulary':['word':'definition']]]
        // Get the list of titles
        if (!titles || titles.length === 0) {
            alert("Please generate titles first!");
            return;
        }

        stories = []; // Reset stories array
        let totalTitles = titles.length;

        // Iterate through the titles and show progress while doing it
        titles.forEach((title, index) => {

            // For each title, call getStories that will ask ChatGPT for the Question and the story and vocabulary
                    // Placeholder: Call getStories to ask ChatGPT for the Question, Story, and Vocabulary
        let question = "Sample Question for " + title; // Replace with actual call to getStories
        let storyText = "Sample Story text for " + title; // Replace with actual call to getStories
        let vocabulary = [{"word": "example", "definition": "an instance serving for illustration"}]; // Replace with actual call to getStories

        var story;
        var selectedMonth = monthSelect.options[monthSelect.selectedIndex].value;
        var selectedGradeLevel = gradeLevelSelect.options[gradeLevelSelect.selectedIndex].value;
            // Let's run the python module to grab the story'
         fetch('/api/story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            month: selectedMonth,
            grade: selectedGradeLevel,
              title: title
          })
        })
            .then(response => response.json())
            .catch(err => {
              console.log(err)
              alert('Error parsing JSON' + err)
            })
            .then(data => {

                story = JSON.parse(data);
              console.log("story is " + story);
                    // add title, question, story, and vocab to stories

                    // call getImage and ask for b&w coloring image and add to stories
                            // Placeholder: Call getImage for b&w coloring image
                let bwImage = "black_and_white_image_url"; // Replace with actual call to getImage


                    // call getImage and ask for color image and add to stories
                            // Placeholder: Call getImage for color image
                let colorImage = "color_image_url"; // Replace with actual call to getImage

                            // Add to stories array
                stories.push({
                    'title': title,
                    'question': story['question'],
                    'story': story['story'],
                    'bwimage': bwImage,
                    'colorimage': colorImage,
                    'vocabulary': story['vocabulary']
                });
                console.log("Added:  " + title);
                displayStory(stories.length-1);
                // Update the progress bar
                let progressPercent = ((stories.length) / totalTitles) * 100;
                updateProgressBar(progressPercent);
            });



        });

         // show first story in the stories tab and update the "1 of 30"
    //displayStory(0);
            // allow user to edit question, title and story and resave
            // allow user to regenerate color or b&w image and resave

         // allow for click back and next buttons to move through the 30 stories:  update the "1 of 30" on each movement

          // allow for generate packet button which then generates the whole packet

            // Activate the Stories tab
        new bootstrap.Tab(storiesTab).show();
})

function displayStory(index) {
    if (index < 0 || index >= stories.length) {
        console.log("Invalid story index");
        return;
    }
    storyIndex = index;

    let story = stories[index];
    // Update the DOM with story details
    // You need to write code here to update the story details in your HTML
    document.getElementById('titleInput').value = story['title'];
    document.getElementById('questionInput').value = story['question'];
    document.getElementById('storyTextarea').innerText = story['story']
    console.log("Displaying story:", story);

    // Update the "1 of 30" indicator
    document.getElementById("pagenum").textContent = `Story ${index + 1} of ${stories.length}`;
}


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
              titles = [];
                try {
                    // Parse the data as JSON
                    var jsonData = JSON.parse(data);

                    if (jsonData && jsonData['titles'] && Array.isArray(jsonData['titles'])) {
                        titles = jsonData['titles'];
                        updateList(titles, "titleList");
                    } else {
                        console.error('Unexpected data format after JSON parsing', jsonData);
                    }
                } catch (error) {
                    console.error('Error parsing data as JSON:', error);
                }


            updateList(titles, "titleList");

                    })


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


    // Add a title to the list manually
  document.getElementById('addTitleBtn').addEventListener('click', () => {
    const title = prompt('Enter title:');
    titles.push(title);
      updateList(titles, "titleList");
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



  // Edit a title that already exists
        // Get modal element
        const modalTitle = document.getElementById('titleModal');

        titleList.addEventListener('click', (e) => {

          // Get clicked li
          const li = e.target.tagName === 'LI' ? e.target : e.target.parentElement;

          // Set selected title
          selectedLi = li;

          // Show modal
          modalTitle.style.display = 'block';

          // Set modal data from li
          document.getElementById('modalTitleName').innerText = li.innerText;

        });



        // Save changes and close modal
        document.getElementById('saveTitleBtn').addEventListener('click', () => {

          // Get updated value
          const updatedTitle = document.getElementById('modalTitle').value;

          // Update selected li
          selectedLi.innerText = updatedTitle;
           // Get index of selected li
          const index = [...titleList.children].indexOf(selectedLi);

          // Update days array
          titles[index] = updatedTitle;
          updateList(titles,'titleList')
          document.getElementById('modalTitle').value="";

          // Hide modal
          modalTitle.style.display = 'none';

        });


        // Delete day and close modal
        document.getElementById('delTitleBtn').addEventListener('click', () => {

            // Get index
              const index = [...titleList.children].indexOf(selectedLi);

              // Remove from list
              titleList.removeChild(selectedLi);

              // Remove from array
              titles.splice(index, 1);

              // Clear input
              document.getElementById('modalTitle').value="";

              // Reset selected
              selectedLi = null;

          updateList(titles,'titleList')
          document.getElementById('modalTitle').value="";

          // Hide modal
          modalTitle.style.display = 'none';

        });


        // Close modal without saving
        document.getElementById('closeTitleBtn').addEventListener('click', () => {


          // Hide modal
          modalTitle.style.display = 'none';
          document.getElementById('modalTitle').value="";

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
  }

  function updateProgressBar(percent) {
    let progressBar = document.getElementById('progressBar');
    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = percent.toFixed(0) + '%';
}

