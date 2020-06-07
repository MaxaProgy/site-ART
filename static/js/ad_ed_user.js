$(document).ready(function() {
    var par;
    par = $('.hidden-section');
    $(par).hide();
    $('#button').click(function(e) {
        $(par).slideToggle('fast');
        e.preventDefault();
    });
    $("#button").on("click", function() {
        var el = $(this);
        el.text() == el.data("text-swap") ? el.text(el.data("text-original")) : el.text(el.data("text-swap"));
    });
});

