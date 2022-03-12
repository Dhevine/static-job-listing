"use strict"
const jobListing__container = document.querySelector(".main-container")
const selectedList_Box = document.querySelector(".filter-container")
const clearBtn = document.getElementById('clear-btn')
let currentArr = []
let filteredArr = []
let active = false
let allArr = []

// filter jobs
function filterJobs(elem, Object_Arr) {
  filteredArr = []
  // place both id and all langauges, roles e.t.c 
  const dee = Object_Arr.map(el => [el.id,...el.languages , el.role, ...el.tools,el.level ]);

  // check if the inputed array is included in the genreal array, then we take the first element which is the id 
  dee.forEach(el => {
    const dee = elem.every(res => el.includes(res));
    // console.log(dee);
    if(dee) {
      filteredArr.push(el[0]) // pushing the id 
    }

  })

}

function removeElem() {
  document.querySelectorAll(".jobs").forEach((el) => el.remove())
}

// dynamically appending tools and languages to the stack
function appendStacks_Used(data, job_ListingArr, type) {
  // console.log(data, job_ListingArr,type);

  data.forEach((el, i) => {
    const stackArr = job_ListingArr[i][type] //access object using bracket notation on typei.e [type]
    if (stackArr.length > 0) {
      stackArr.forEach((val) => {
        const append_Stack = `
     <button class="job-btn">${val}</button>
    `
        el.insertAdjacentHTML("beforeend", append_Stack)
      })
    }
  })
}

// append searched jobs
function available_Jobs(arr1, arr2) {
  let finalArr = []
  removeElem()
  arr1.forEach((id_No) => {
    const [appendArr] = arr2.filter((el) => el.id === id_No)
    finalArr.push(appendArr)
    append_Jobs(appendArr)
  })

  const job_stack = document.querySelectorAll(".job-stack")
  appendStacks_Used(job_stack, finalArr, "tools")
  appendStacks_Used(job_stack, finalArr, "languages")
}

// append ticked opton
function appendOption(target) {
  if (currentArr.includes(target)) return //guard clause
  currentArr.unshift(target)

  document
    .querySelector(".filter-container")
    .querySelectorAll(".select-icon")
    .forEach((el) => el.remove())

  currentArr.forEach((item) => {
    const html = `
     <div class="select-icon">
        <button class="user-option">${item}</button>
        <button class="remove-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"/></svg>
        </button>
      </div>
   `
    selectedList_Box.insertAdjacentHTML("afterbegin", html)
  })
}

function append_Jobs(el) {
  const html = `
      <article class="jobs ${el.new && el.featured ? 'border' : ''}" id= ${el.id}'>
      <figure class="job-img"><img src="${el.logo}" alt="" /></figure>
      
      <div class = 'job-content'>
        <ul class="job--updates">
        <li><h3>${el.company}</h3></li>
        <li class="new-tag" style="display: ${
          el.new ? "block" : "none"
        };">NEW!</li>
        <li class="featured-tag" style="display: ${
          el.featured ? "block" : "none"
        };">FEATURED</li>
          </ul>
          
          <p class="job--type">${el.position}</p>
        
          <div class="job-specifiaction">
          <span>${el.postedAt}</span>
        <span>• ${el.contract}</span>
        <span>• ${el.location}</span>
        </div>
        
        </div>
        
        <div class="job-stack" id =${el.id}>
        <button class="job-btn">${el.role}</button>
        <button class="job-btn">${el.level}</button>
        </div>
        </article>
        `

  jobListing__container.insertAdjacentHTML("beforeend", html)
}


function clearFunc(arr) {
  document.querySelectorAll(".jobs").forEach((el) => el.remove())
  arr.forEach((el) => {
    append_Jobs(el)
  })
  const job_stack = document.querySelectorAll(".job-stack")
  appendStacks_Used(job_stack, arr, "tools")
  appendStacks_Used(job_stack, arr, "languages")
  selectedList_Box.style.display = "none"
}

function getData() {
  return fetch("./data.json")
    .then((res) => res.json())
    .then((arr) => {
      allArr = arr
      arr.forEach((job_info) => {
        append_Jobs(job_info)
      })

      // appending dynamically on tools and languaages
      const job_stack = document.querySelectorAll(".job-stack")
      appendStacks_Used(job_stack, arr, "tools")
      appendStacks_Used(job_stack, arr, "languages")

      jobListing__container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("job-btn")) return

        const clicked_Option = e.target.textContent
        selectedList_Box.style.display = "flex"
        appendOption(clicked_Option)
        filterJobs(currentArr, arr)
        available_Jobs(filteredArr, arr)
      })

      selectedList_Box.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("remove-icon") ||
          e.target.tagName === "path" ||
          e.target.tagName === "svg"
        ) {
          const clicked = e.target
            .closest(".select-icon")
            .querySelector(".user-option").textContent

          currentArr = currentArr.filter((el) => el !== clicked)
          e.target.closest(".select-icon").remove()

          if (currentArr.length > 0) {
            filterJobs(currentArr, arr)
            available_Jobs(filteredArr, arr)
          } else {
            clearFunc(arr)
          }
        }
      })

      clearBtn.addEventListener('click' , () => {
        clearFunc(arr)
      })
    })
}

getData()


