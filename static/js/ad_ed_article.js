window.onload = function() {

    for (var i = 0; i < attach_image.length; i++) {
        var elem = document.createElement("div");
        html = '<div class="content-centering block-decor images block-green"><img id = "' + attach_image[i] + '" src "#" class="content-centering_element" alt=""><div class="sel"><img src="/static/img/minus.jpg" class="sel" onclick="image_click(this)" alt=""></div>';
        elem.innerHTML = html;
        document.getElementById('images_view').appendChild(elem);
        document.getElementById(attach_image[i]).src = "/static/media/image/" + attach_image[i];
    }

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

    function randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    $("#add_image").click(function() {
        var input=document.createElement('input');
        input.type = "file";

        input.name = current_user_id + "_" + Date.now() + randomInt(0, 9).toString();
        input.style.display = "none";
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = e => {
            var file = e.target.files[0];
            document.getElementById('images').appendChild(input);

            var elem = document.createElement("div");
            html = '<div class="content-centering block-decor images block-green"><img id = "' + input.name + '" src "#" class="content-centering_element" alt=""><div class="sel"><img src="/static/img/minus.jpg" class="sel" onclick="image_click(this)" alt=""></div>';
            elem.innerHTML = html;
            document.getElementById('images_view').appendChild(elem);
            document.getElementById(input.name).src = window.URL.createObjectURL(file);
        };
        input.click();
    });

    $("form").submit(function (event) {

        if ($("#title").val().trim()) {
            $("#title").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#title").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-title").style.display = "block";
        }

        if ($("#preview").val().trim()) {
            $("#preview").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#preview").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-preview").style.display = "block";
        }

        if ($("#text").val().trim()) {
            $("#text").removeClass("is-invalid").removeClass("is-valid");
        } else {
            $("#text").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }

        if (($("#title").val().trim()) && ($("#preview").val().trim()) && (($("#text").val().trim()))) {
            event.submit();
        } else {
            event.preventDefault();
        }
    })

    $("#title").keyup(function() {
        if ($("#title").val().trim()) {
            $("#title").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-title").style.display = "none";
        } else {
            $("#title").removeClass("is-valid").addClass("is-invalid");
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

    $("#text").keyup(function() {
        if ($("#text").val().trim()) {
            $("#text").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("invalid-text").style.display = "none";
        } else {
            $("#text").removeClass("is-valid").addClass("is-invalid");
            document.getElementById("invalid-text").style.display = "block";
        }
    });
};

function image_click(elem) {
    elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);
    console.log(attach_image)
    index = attach_image.indexOf(elem.parentNode.parentNode.childNodes[0].id)
    if (index != -1) {
        attach_image.splice(index, 1);
    }
    console.log(attach_image)

};