import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"

import {
  setActiveLink, renderHtml, loadHtml
} from "./utils.js"


import { courseEditor } from "./pages/courseEditor/courseEditor.js";
import { initTestimonials } from "./pages/testimonials/testimonials.js";
import { initLogin } from "./pages/login/login.js";


window.addEventListener("load", async () => {

  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  
  const templateCourseEditor = await loadHtml("./pages/courseEditor/courseEditor.html")
  const templateTestimonials = await loadHtml("./pages/testimonials/testimonials.html")
  const templateLogin = await loadHtml("./pages/login/login.html")

  

  const router = new Navigo("/",{hash:true});
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router
 

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": (match) => {
        renderHtml(templateLogin, "content")
        initLogin()
      },
      "/course-editor": (match) => {
        renderHtml(templateCourseEditor, "content")
        courseEditor()
      },
      "/testimonials": (match) => {
        renderHtml(templateTestimonials, "content")
        initTestimonials()
      }
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}