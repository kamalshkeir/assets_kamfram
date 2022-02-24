let btns = document.querySelectorAll(".btn-right");
let callbackPostIndex = (data) => {
    if (data.success) {
        notification.show(data.success,"success");
    } else if (data.error) {
        notification.show(data.error,"error");
    }
};

btns.forEach((btn) => {
    btn.addEventListener("click",(e) => {
            e.preventDefault();
            var confirmation = window.confirm(`Are your sure u want to drop this table ?`);
            if (confirmation == true) {
            postData("/admin/drop/table",{
                "table":btn.dataset.table
            },callbackPostIndex);
        }
        
    })
});