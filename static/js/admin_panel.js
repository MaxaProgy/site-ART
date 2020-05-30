// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.onload = function() {

    let users = document.getElementById("div_users")
    let autors = document.getElementById("div_autors")
    let articles = document.getElementById("div_articles")
    let active_button_menu = getCookie("active_button_menu")

    document.getElementById(active_button_menu).className +=" active"
    document.getElementById("div_" + active_button_menu).style.display = "block"

    document.getElementById("users").style.display = "block"
    document.getElementById("autors").style.display = "block"
    document.getElementById("articles").style.display = "block"

    document.getElementById('users').addEventListener('click', function (e) {
        users.style.display = "block";
        autors.style.display = "none";
        articles.style.display = "none";
        document.cookie = "active_button_menu=users; path=/";
    });
    document.getElementById('autors').addEventListener('click', function (e) {
        users.style.display = "none";
        autors.style.display = "block";
        articles.style.display = "none";
        document.cookie = "active_button_menu=autors; path=/";
    });
    document.getElementById('articles').addEventListener('click', function (e) {
        users.style.display = "none";
        autors.style.display = "none";
        articles.style.display = "block";
        document.cookie = "active_button_menu=articles; path=/";
    });
};
