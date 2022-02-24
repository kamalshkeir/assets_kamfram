let form = document.getElementById("myform");
let model_name = form.dataset.model;
let model_id = form.dataset.id;
let inputs = document.querySelectorAll(".input");
let editor;

// initialise editor if exist on page
if (document.body.contains(document.getElementById("editor"))) {
    editor = new Jodit('#editor');
    editor.value = document.getElementById("editor").dataset.val;
}

// update form handler
let callbackPost = (data) => {
    if(data.success) {
        notification.show(data.success,"success");
    }else if (data.error) {
        notification.show(data.error,"error");
    }
}

let data = new FormData();
inputs.forEach((input) => {
    input.addEventListener("change",(e) => {
        e.preventDefault();
        if (input.type == "file") {
            if (input.files) {
                data.append(input.getAttribute("name"),input.files[0]);
            }
        } else if (input.type == "checkbox") {
            let checked;
            if (input.checked) {
                data.append(input.getAttribute("name"),"true")
            } else {
                data.append(input.getAttribute("name"),"false")
            }
        } else {
            data.append(input.getAttribute("name"),input.value)
        }
    })
})

form.addEventListener("submit",(e) => {
    e.preventDefault();
    if (editor != null) {
        let name = document.getElementById("editor").dataset.key;
        data.append(name,editor.value)
    } 
    data.append("table",model_name);
    data.append("row_id",model_id);
    postFormData(`/admin/update/row`,data,callbackPost);
})



