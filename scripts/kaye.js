(function($) {

    // default state - mobile
    var windowState = 'sm';

    $(document).ready(function() {

        // setup 'Back to Top' link
        setupGotoTop();
        // setup smooth scrolling
        smoothScroll();

        // Get display values
        var sm = $('span.sm').css('display'),
            md = $('span.md').css('display'),
            lg = $('span.lg').css('display');

        // Determine breakpoint through the changed CSS property
        if ( sm === 'block' ) { configSM(); }
        if ( md === 'block' ) { configMD(); }
        if ( lg === 'block' ) { configLG(); }

        // When window is resized
        $(window).resize(function() {

            // Get display values
            var sm = $('span.sm').css('display'),
                md = $('span.md').css('display'),
                lg = $('span.lg').css('display');

            // Determine breakpoint through the changed CSS property
            if ( sm === 'block' && windowState !== 'sm' ) { configSM(); }
            if ( md === 'block' && windowState !== 'md' ) { configMD(); }
            if ( lg === 'block' && windowState !== 'lg' ) { configLG(); }
        });

    });

    function setupMobileNav() {
        var nav = $('#site-nav'),
            navToggle = $('#nav-toggle'),
            no = 'is-open',
            newHeight = nav.height(),
            html = $('html');

        // collapse nav-anchor
        nav.removeClass(no);
        // toggle nav
        navToggle.on('click', function(e) {
            // check if nav is open
            if ( nav.hasClass(no) ) {
                // close nav
                nav.animate({
                    height: 0
                }, 300, function() {
                    // remove style attr
                    nav.removeClass(no).removeAttr('style');
                });
            } else {
                // open nav
                nav.animate({
                    height: newHeight
                }, 300, function() {
                    // remove style attr
                    nav.addClass(no).removeAttr('style');
                });
            }
        });

        // hide nav if user touch outside the menu
        html.on('touchend', function(e) {
            nav.animate({
                height: 0
            }, 300, function() {
                nav.removeClass(no).removeAttr('style');
            });
        });
        // stop propagation to nav area
        nav.on('touchend', function(e) {
            e.stopPropagation();
        });
    }

    function setupGotoTop() {
        var offset = $('#site-header').height(),
            duration = 500;
        $(window).scroll(function() {
            if ($(this).scrollTop() > offset) {
                $('.goto-top').removeClass('is-hidden').fadeIn(duration).removeAttr('style');
            } else {
                $('.goto-top').addClass('is-hidden').fadeOut(duration).removeAttr('style');
            }
        });
    }

    function smoothScroll() {
        $('a[href^="#"]').on('click',function (e) {
            e.preventDefault();

            var target = this.hash,
            $target = $(target);

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 500, 'swing', function () {
                window.location.hash = target;
            });
        });
    }

    function cleanNav() {
        $('.site-navigation').addClass('is-open');
    }

    function configSM() {
        setupMobileNav();
        windowState = 'sm';
    }

    function configMD() {
        cleanNav();
        windowState = 'md';
    }

    function configLG() {
        cleanNav();
        windowState = 'lg';
    }

})(jQuery);