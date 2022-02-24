let deletebtns = document.querySelectorAll(".deleteBtn");
let closeBtn = document.querySelector(".btn-close");
let createBtn = document.querySelector("#btn-create");
let exportBtn = document.querySelector("#btn-export");
let importBtn = document.querySelector("#btn-import");
let importInput = document.querySelector("input#import");
let modal = document.querySelector(".modal");
let modelName = document.getElementById("model-name").dataset.model;
let form = document.getElementById("myform");
let html = document.querySelector("html");


// initialise editor if exist 
let editor;
if (document.body.contains(document.getElementById("editor"))) {
    editor = new Jodit('#editor');
    editor.value = document.getElementById("editor").dataset.val;
}


createBtn.addEventListener("click",(e) => {
  e.preventDefault();
  modal.classList.toggle('active');
})

closeBtn.addEventListener("click",(e) => {
  e.preventDefault();
  modal.classList.toggle('active');
})


/* close modal on click outside */

html.addEventListener("click", function (e) {
    if (e.target == document.body || e.target == document.querySelector(".wrapper")) {
      if (modal.classList.contains("active")) {
        modal.classList.remove("active");
      }
    } 
});

/* CREATE ROW */

let handlepostCreate = (data) => {
      if(data.success) {
          form.reset();
          modal.classList.remove('active');
          window.location.reload();

      }else if (data.error) {
          notification.show(data.error,"error");
      }
}

form.addEventListener("submit",(e) => {
  e.preventDefault();
  let inputs = document.querySelectorAll(".input");

  let data = new FormData();
  inputs.forEach(input => {
    if (input.type == "file") {
      if (input.files) {
        data.append(input.getAttribute("name"),input.files[0]);
      }
    } else {
      let val = input.value;
      let name = input.getAttribute("name");
      if (val == "on" || val == "off") {
        val = input.checked;
      } 
      console.log("name:",name,"   val:",val);
      data.append(name,val)
    }
  });
  if (editor != null) {
    let name = document.getElementById("editor").dataset.key;
    data.append(name,editor.value)
  }
  data.append("table",modelName)
  postFormData(`/admin/create/row`,data,handlepostCreate);
})


/* IMPORT EXPORT */
exportBtn.addEventListener("click",(e) => {
  confirm = window.confirm(`Tu veux vraiment exporter le tableau ${modelName} ?`)
  if (confirm) {
    e.preventDefault();
    window.location.href = `/admin/export/${modelName}`;
  } else {
    notification.show("Exportation annuler.")
  }
})

importBtn.addEventListener("click",(e) => {
  e.preventDefault();
  importInput.click();
})

let callbackImport = (data) => {
  if(data) {
    if (data.success) {
      notification.show(data.success,"success");
    } else if (data.error) {
      notification.show(data.error,"error");
    }
  }
}
importInput.addEventListener("change",() => {
  let data = new FormData();
  if (importInput.files) {
    data.append("thefile",importInput.files[0]);
    data.append("table",modelName);
  }
  //post file to server
  postFormData("/admin/import",data,callbackImport);
})



/* DELETE ROW */
let handlepostDelete = (data) => {
      if(data.success) {
          notification.show(data.success,"success");
          document.querySelector(`.deleteBtn[data-id='${data.id}']`).closest('tr').remove();
      }else if (data.error) {
          notification.show(data.error,"error");
      }
}

let deleteFunc = (btn) => {
  let id = btn.dataset.id;
  var c = window.confirm(`Are your sure u want to delete ?`);
  if (c == true) {
    postData(`/admin/delete/row`,{
          "mission":"delete_row",
          "model_name":modelName,
          "id":id,
    },handlepostDelete);
  } else {
    notification.show("DELETE WAS CANCELED.","info");
  } 
}

deletebtns.forEach((btn) => {
  btn.addEventListener("click",(e) => {
    e.preventDefault();
    deleteFunc(btn);
  })
})


/* Infinite Scroll */
let page = 1;
var scrolled = false;
let i = 10;
let handlepostScroll = (data) => {
  if (data.rows != null) {
    if (data.rows.length > 0) {
      data.rows.forEach((row) => {
        let tr = document.createElement("tr");
        for (var key in row) {
          let content;
          let td = document.createElement("td");
          switch (key) {
            case "id":
              td.innerHTML = `
              <p style="overflow-wrap:break-word;max-width: 20vw;">
                    <a href="/admin/get/${modelName}/${row[key]}">${row[key]}</a>
              </p>
              `;
              break;
            case "image" || "photo" || "img":
              td.innerHTML = `
                    <img src="${row[key]}" alt="image">
              `;
              break;
            default:
              if (typeof(row[key]) == "boolean") {
                if (row[key]) {
                  td.innerHTML = `
                  <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" checked disabled>
                  <label style="display: none;" for="check-${i}" >Checkbox</label> 
                `;
                } else {
                  td.innerHTML = `
                    <input id="check-${i}" name="check-${i}" type="checkbox" class="checkbox" disabled>
                    <label style="display: none;" for="check-${i}" >Checkbox</label> 
                  `;
                }
                break;
              } else {
                td.innerHTML = `
                    <p style="overflow-wrap:break-word;max-width: 20vw;">
                        ${row[key]}
                    </p>
                `;
                break;
            }
          }
          tr.insertAdjacentElement("beforeend",td);
        }
        let td_delete = document.createElement("td");
        td_delete.innerHTML = `
            <button class="btn btn-danger deleteBtn" data-id="${row.id}">X</button>
          `;
        tr.insertAdjacentElement("beforeend",td_delete);
        document.querySelector(".tbody").appendChild(tr);
        let del_btn = document.querySelector(`.deleteBtn[data-id='${row.id}']`);
        del_btn.addEventListener("click",(e) => {
          e.preventDefault();
          deleteFunc(del_btn);
        });
      })
      setTimeout(() => {
        scrolled=false
      },500)
    }
    
  }
}

window.addEventListener('scroll', () => {
  const {scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if((scrollTop + clientHeight) >= scrollHeight-50) {
    if (!scrolled) {
      scrolled = true;
      page++;
      postData(`/admin/table/${modelName}`,{
            "model_name":modelName,
            "page_num":`${page}`,
      },handlepostScroll); 
    }    
  }
});