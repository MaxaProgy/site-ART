$(document).ready(function() {
    $('.hidden-section').hide();

    // Отправка и валидация
    $("form").submit(function (event) {
        if ($("#new_password").val() == $("#repeat_password").val()) {
            $("#new_password").removeClass("is-invalid").removeClass("is-valid");
            $("#repeat_password").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#new_password").removeClass("is-valid").addClass("is-invalid");
            $("#repeat_password").removeClass("is-valid").addClass("is-invalid");
            event.preventDefault();
        }
    });
});

// Выплывание поля ввода пароля
function click_password(el) {
    $('.hidden-section').slideToggle('fast');
    if (el.value == "Сменить пароль") {
        el.value = "Отменить смену пароля";
    } else {
        el.value = "Сменить пароль";
        document.getElementById("new_password").value = "";
        document.getElementById("repeat_password").value = "";
    }
};
