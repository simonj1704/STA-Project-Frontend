import { API_URL } from "../../settings.js";
import {
  makeOptions,
  handleHttpErrors,
  sanitizeStringWithTableRows,
} from "../../utils.js";

export async function initTestimonials() {
  fetchTestimonials();
  document.getElementById("submitButton").onclick = () => submitTestimonial();
  // Add a new event listener outside the loop
  

  document.getElementById("tablerows").onclick = (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const testimonialId = event.target.dataset.id;
      deleteTestimonial(testimonialId);
    }
  }
}

async function fetchTestimonials() {
  document.getElementById("error").innerText = "";
  try {
    const URL = API_URL + "/testimonials";
    const testimonials = await fetch(URL, makeOptions("GET", null, false)).then(
      handleHttpErrors
    );
    const rows = testimonials
      .map((testimonial) => {
        console.log(testimonial);
        return `<tr>
          <td>${testimonial.id}</td>
          <td>${testimonial.text}</td>
          <td>${testimonial.submissionName}</td>
          <td>
          <button style="margin-right: 10px" class="btn btn-primary edit-btn" data-id="${testimonial.id}">Edit</button>
          <button class="btn btn-danger delete-btn" data-id="${testimonial.id}">Delete</button>
          </td></tr>
          </tr>`;
      })
      .join("\n");
    const saferows = sanitizeStringWithTableRows(rows);
    document.getElementById("tablerows").innerHTML = saferows;
  } catch (error) {
    if (error.apiError) {
      document.getElementById("error").innerText = error.apiError.message;
    } else {
      document.getElementById("error").innerText = error.message;
      console.log("Error: ", error);
    }
  }
}

function submitTestimonial() {
  // Add logic to handle the submitted testimonial
  const text = document.getElementById("text").value;
  const submissionName = document.getElementById("submissionName").value;

  // Create a testimonial object
  const testimonial = {
    text: text,
    submissionName: submissionName,
    image: "null",
  };

  // Perform any necessary validation or data manipulation here

  // Send the testimonial to the server
  sendTestimonial(testimonial);

  // You can access the input values using document.getElementById
  console.log("Testimonial submitted");
}

async function sendTestimonial(testimonial) {
  try {
    const URL = API_URL + "/testimonials";
    const options = makeOptions("POST", testimonial, true);
    const response = await fetch(URL, options).then(handleHttpErrors);
    console.log("Testimonial sent successfully:", response);
    // Optionally, you can update the testimonials list after submitting
    fetchTestimonials();
  } catch (error) {
    if (error.apiError) {
      document.getElementById("error").innerText = error.apiError.message;
    } else {
      document.getElementById("error").innerText = error.message;
      console.log("Error: ", error);
    }
  }
}

async function deleteTestimonial(id) {
  // Add logic to delete a testimonial
  try {
    const URL = API_URL + "/testimonials/delete/" + id;
    const options = makeOptions("DELETE", null, true);
    const response = await fetch(URL, options).then(handleHttpErrors);
    console.log("Testimonial deleted successfully:", response);
    // Optionally, you can update the testimonials list after deleting
    fetchTestimonials();
  } catch (error) {
    if (error.apiError) {
      document.getElementById("error").innerText = error.apiError.message;
    } else {
      document.getElementById("error").innerText = error.message;
      console.log("Error: ", error);
    }
  }
  console.log("Deleting testimonial with id:", id);
}
