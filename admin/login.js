let form = document.getElementById("admin-login");
let callbackPOST = (data) => {
    if (data.success) {
        window.location.href = "/admin";
    } else if (data.error) {
        notification.show(data.error,"error");
    }
}
form.addEventListener("submit",(e) => {
    e.preventDefault();
    email = form.email.value;
    pass = form.password.value;
    postData("/admin/login",{
        "email":email,
        "password":pass
    },callbackPOST);
})