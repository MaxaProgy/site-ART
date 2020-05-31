window.addEventListener("load", function() {

    //On Scroll Functionality
    $(window).scroll( () => {
        var windowTop = $(window).scrollTop();
        windowTop > 100 ? $('nav-base').addClass('navShadow') : $('nav-base').removeClass('navShadow');
        windowTop > 100 ? $('#ul-base').css('top','75px') : $('#ul-base').css('top','75px');
    });

    //Click Logo To Scroll To Top
    $('#logo').on('click', () => {
        $('html,body').animate({
            scrollTop: 0
        },500);
    });

    //Toggle Menu
    $('#menu-toggle').on('click', () => {

        $('#menu-toggle').toggleClass('closeMenu');
        $('#ul-base').toggleClass('showMenu');

        $('.li-base').on('click', () => {
            $('#ul-base').removeClass('showMenu');
            $('#menu-toggle').removeClass('closeMenu');
        });
    });

});