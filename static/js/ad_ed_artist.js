window.onload = function() {
    // Показываем ранее сохраненные картинки для карусели при открытии формы
    for (var i = 0; i < attach_image.length; i++) {
        var elem = document.createElement("div");
        html = '<div class="content-centering block-decor images block-green"><img id = "' + attach_image[i] + '" src "#" class="content-centering_element" alt=""><div class="sel"><img src="/static/img/minus.jpg" class="sel" onclick="image_click(this)" alt=""></div>';
        elem.innerHTML = html;
        document.getElementById('images_view').appendChild(elem);
        document.getElementById(attach_image[i]).src = "/static/media/image/" + attach_image[i];
    }

    // Выбор файла для main_image
    document.getElementById('img_click').addEventListener('click', function (e) {
        var input = document.getElementById("img");

        input.type = 'file';
        input.accept=".jpg, .jpeg, .png";
        input.onchange = e => {
            var file = e.target.files[0];
            document.getElementById("img_src").src = window.URL.createObjectURL(file);
        };
        input.click();
    });

    // Случайное число для последнего символа в названии файла. Для того чтобы в одну
    // и ту же секунду времени не было два одинаковых файла
    function randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    // Добавление картинки для карусели
    $("#add_image").click(function() {
        let input=document.createElement('input');
        input.type = "file";
        // имя файла = d пользователя + число в UNIX дате + случайное число от 0 до 9
        input.name = current_user_id + "_" + Date.now() + randomInt(0, 9).toString();
        input.style.display = "none";
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = e => {
            let file = e.target.files[0];
            document.getElementById('images').appendChild(input);

            let filename_split =  file.name.split(".");
            input.name = input.name + "."+ filename_split[filename_split.length - 1];
            attach_image.push(input.name);
            input.id = input.name;

            let html = '<div class="content-centering block-decor images block-green"><img id = "' + input.name + '" src "#" class="content-centering_element" alt=""><div class="sel"><img src="/static/img/minus.jpg" class="sel" onclick="image_click(this)" alt=""></div>';
            let elem = document.createElement("div");
            elem.innerHTML = html;
            document.getElementById('images_view').appendChild(elem);
            document.getElementById(input.name).src = window.URL.createObjectURL(file);
        };
        input.click();
    });


    // Отправка и валидация
    $("form").submit(function (event) {

        if ($("#name").val().trim()) {
            $("#name").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#name").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-title").style.display = "block";
        }

        if ($("#preview").val().trim()) {
            $("#preview").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#preview").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-preview").style.display = "block";
        }

        if ($("#thesis").val().trim()) {
            $("#thesis").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#thesis").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }

        if ($("#text_biography").val().trim()) {
            $("#text_biography").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#text_biography").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }

        if ($("#text_5_facts").val().trim()) {
            $("#text_5_facts").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#text_5_facts").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }
        if (($("#name").val().trim()) && ($("#preview").val().trim()) && ($("#thesis").val().trim()) && ($("#text_biography").val().trim())  && ($("#text_5_facts").val().trim())) {
            document.getElementById("attach_image").value = attach_image.join(" ");

        } else {
            event.preventDefault();
        }
    });

    $("#name").keyup(function() {
        if ($("#name").val().trim()) {
            $("#name").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-title").style.display = "none";
        } else {
            $("#name").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-title").style.display = "block";
        }
    });
    $("#preview").keyup(function() {
        if ($("#preview").val().trim()) {
            $("#preview").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-preview").style.display = "none";
        } else {
            $("#preview").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-preview").style.display = "block";
        }
    });

    $("#thesis").keyup(function() {
        if ($("#thesis").val().trim()) {
            $("#thesis").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-text").style.display = "none";
        } else {
            $("#thesis").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }
    });

    $("#text_biography").keyup(function() {
        if ($("#text_biography").val().trim()) {
            $("#text_biography").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-text").style.display = "none";
        } else {
            $("#text_biography").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }
    });

    $("#text_5_facts").keyup(function() {
        if ($("#text_5_facts").val().trim()) {
            $("#text_5_facts").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-text").style.display = "none";
        } else {
            $("#text_5_facts").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }
    });
};

// Удаление картинки по нажатию на крестик
function image_click(elem) {
    let name = elem.parentNode.parentNode.childNodes[0].id;
    index = attach_image.indexOf(name);
    if (index != -1) {
        attach_image.splice(index, 1);
    }
    elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);

    let el = document.getElementById(name);
    el.parentNode.removeChild(el);
}

