import { API_URL } from "../../settings.js";

export function courseEditor() {
  console.log("Course Editor") 
  fetchCourses();
  document.getElementById("submitButton").onclick = addCourse;
}



async function fetchCourses() {
  let tbody = document.getElementById("tbody");
  try {
    const response = await fetch(API_URL +'/courses', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Clear existing content
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }

      for (let i = 0; i < data.length; i++) {
        const tr = document.createElement('tr');
        
        // Create and append table cells
        tr.appendChild(createTableCell(data[i].id));
        tr.appendChild(createTableCell(data[i].title));
      

        // Create and append datetime-local cell
        const dateTd = document.createElement('td');
        const dateInput = document.createElement('input');
        dateInput.setAttribute('type', 'datetime-local');
        dateInput.setAttribute('value', data[i].startDate);
        dateInput.setAttribute('readonly', 'true');
        dateTd.appendChild(dateInput);
        tr.appendChild(dateTd);

        tr.appendChild(createTableCell(data[i].venue));
        tr.appendChild(createTableCell(data[i].pageLink));

        // Create and append buttons

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.background="darkred";
        deleteButton.style.color="white";
       deleteButton.onclick = () => deleteCourse(data[i].id);

        tr.appendChild(deleteButton);

        // Append the row to the tbody
        tbody.appendChild(tr);
      }
    } else {
      console.error("Error fetching: Response status:" + response.status);
      throw new Error();
    }
  } catch (error) {
    console.log('ERROR ' + error.message);
  }
}

function createTableCell(value) {
  const td = document.createElement('td');
  td.textContent = value;
  return td;
}


async function addCourse() {
  let bodyString = `
  {
    "title": "${document.getElementById("title").value}",
    "description": "", 
    "startDate": "${document.getElementById("start-date").value}",

    "pageLink": "${document.getElementById("pageLink").value}",
    "venue": "${document.getElementById("venue").value}"

  }`;
  console.log(bodyString)
  try {
    const response = await fetch(API_URL + '/courses', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      },
      body: bodyString
    })
    if (response.ok) {
      
      console.log("course added");
    }
    else {
      console.error("Error fetching: Reponse status:" + response.status)
      throw new Error()
    }
  }
  catch(error){
    console.log('ERROR add ' + error.message)
  }
  fetchCourses();

}

async function deleteCourse(id){
  try {
    const response = await fetch(API_URL + `/courses/delete/${id}`,{
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
      
    })
    if (response.ok){
      console.log("delete SUCCESS!")
    }
    else {
      console.error("ERROR. Response status: " + response.status); throw new Error();
    }
  }
  catch(error){
    console.error(error.message)
  }
  fetchCourses();

}