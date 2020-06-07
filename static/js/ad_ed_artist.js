window.onload = function() {
    // Выбор файла
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

    // Случайное число для последнего символа в названии файла. Для того чтобы в одну и ту же секунду времени не было два одинаковых файла
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
            input.name = input.name + "."+ filename_split[filename_split.length - 1]
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
};

