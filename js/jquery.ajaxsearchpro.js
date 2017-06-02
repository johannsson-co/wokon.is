(function(jQuery, $, window){
/*! Ajax Search pro 4.0 js */
(function ($) {
    var methods = {

        init: function (options, elem) {
            var $this = this;

            this.elem = elem;
            this.$elem = $(elem);


            $this.searching = false;
            $this.o = $.extend({}, options);
            $this.n = new Object();
            $this.n.container =  $(this.elem);
            $this.o.rid = $this.n.container.attr('id').match(/^ajaxsearchpro(.*)/)[1];
            $this.o.id = $this.n.container.attr('id').match(/^ajaxsearchpro(.*)_/)[1];
            $this.n.probox = $('.probox', $this.n.container);
            $this.n.proinput = $('.proinput', $this.n.container);
            $this.n.text = $('.proinput input.orig', $this.n.container);
            $this.n.textAutocomplete = $('.proinput input.autocomplete', $this.n.container);
            $this.n.loading = $('.proinput .loading', $this.n.container);
            $this.n.proloading = $('.proloading', $this.n.container);
            $this.n.proclose = $('.proclose', $this.n.container);
            $this.n.promagnifier = $('.promagnifier', $this.n.container);
            $this.n.prosettings = $('.prosettings', $this.n.container);
            $this.n.searchsettings = $('#ajaxsearchprosettings' + $this.o.rid);
            $this.n.trythis = $("#asp-try-" + $this.o.rid);
            $this.o.blocking = false;
            $this.resultsOpened = false;
            if ($this.n.searchsettings.length <= 0) {
                $this.n.searchsettings = $('#ajaxsearchprobsettings' + $this.o.rid);
                $this.o.blocking = true;
            }
            $this.n.resultsDiv = $('#ajaxsearchprores' + $this.o.rid);
            $this.n.hiddenContainer = $('#asp_hidden_data');
            $this.n.aspItemOverlay = $('.asp_item_overlay', $this.n.hiddenContainer);

            $this.resizeTimeout = null;

            if ( typeof($.browser) != 'undefined' &&
                 typeof($.browser.mozilla) != 'undefined' &&
                 typeof($.browser.version) != 'undefined' &&
                 parseInt($.browser.version) > 13
                )
                $this.n.searchsettings.addClass('asp_firefox');

            $this.n.showmore = $('.showmore', $this.n.resultsDiv);
            $this.n.items = $('.item', $this.n.resultsDiv);
            $this.n.results = $('.results', $this.n.resultsDiv);
            $this.n.resdrg = $('.resdrg', $this.n.resultsDiv);

            // Isotopic Layout variables
            $this.il = {
                columns: 3,
                itemsPerPage: 6
            };

            $this.firstClick = true;
            $this.post = null;
            $this.postAuto = null;
            $this.cleanUp();
            //$this.n.text.val($this.o.defaultsearchtext);
            $this.n.textAutocomplete.val('');
            $this.o.resultitemheight = parseInt($this.o.resultitemheight);
            $this.scroll = new Object();
            $this.settScroll = null;
            $this.n.resultsAppend = $('#wpdreams_asp_results_' + $this.o.id);
            $this.n.settingsAppend = $('#wpdreams_asp_settings_' + $this.o.id);
            $this.currentPage = 1;
            $this.isotopic = null;
            $this.lastSuccesfulPhrase = ''; // Holding the last phrase that returned results

            $this.animation = "bounceIn";
            switch ($this.o.resultstype) {
                case "vertical":
                    $this.animation = $this.o.vresultanimation;
                    break;
                case "isotopic":
                    $this.animation = $this.o.iianimation;
                    break;
                default:
                    $this.animation = $this.o.hresultanimation;
            }

            $this.filterFns = {
                number: function () {
                    var $parent = $(this).parent();
                    while (!$parent.hasClass('isotopic')) {
                        $parent = $parent.parent();
                    }
                    var number = $(this).attr('data-itemnum');
                    //var currentPage = parseInt($('nav>ul li.asp_active span', $parent).html(), 10);
                    var currentPage = $this.currentPage;
                    //var itemsPerPage = parseInt($parent.data("itemsperpage"));
                    var itemsPerPage = $this.il.itemsPerPage;

                    return (
                        (parseInt(number, 10) < itemsPerPage * currentPage) &&
                            (parseInt(number, 10) >= itemsPerPage * (currentPage - 1))
                        );
                }
            };

            $this.disableMobileScroll = false;

            if ($this.o.compact.enabled == 1 && $this.o.compact.position == 'fixed' && is_touch_device()) {
                $this.n.container.detach().appendTo("body");
                $this.n.trythis.detach().appendTo("body");
                $this.n.container.css('position', 'absolute');
                $this.n.trythis.css('position', 'absolute');
                var originalContainerOffTop = $this.n.container.offset().top;
                $(window).scroll(function() {
                    if ($this.resultsOpened && $this.dragging) return;
                    clearTimeout($.data(this, 'xscrollTimer'));
                    $.data(this, 'xscrollTimer', setTimeout(function() {
                        $this.n.container.animate({
                            'top': $(window).scrollTop() + originalContainerOffTop
                        }, 150);
                        $this.n.trythis.animate({
                            'top': $(window).scrollTop() + originalContainerOffTop + $this.n.container.outerHeight()
                        }, 150);
                    }, 130));
                });
            }
            if ($this.o.compact.enabled == 1 && $this.o.compact.position != 'static') {
                $this.n.trythis.css({
                    top: $this.n.container.position().top + $this.n.container.outerHeight(true),
                    left: $this.n.container.offset().left
                });
            }


            if ($this.n.settingsAppend.length > 0) {
                /*
                    When the search settings is set to hovering, but the settings
                    shortcode is used, we need to force the blocking behavior,
                    since the user expects it.
                */
                if ($this.o.blocking == false) {
                    $this.n.searchsettings.attr(
                        "id",
                        $this.n.searchsettings.attr("id").replace('prosettings', 'probsettings')
                    );
                    $this.o.blocking = true;
                }
                $this.n.searchsettings.detach().appendTo($this.n.settingsAppend);
            } else if ($this.o.blocking == false) {
                $this.n.searchsettings.detach().appendTo("body");
            }

            if ($this.o.resultsposition == 'hover' && $this.n.resultsAppend.length <= 0) {
                $this.n.resultsDiv.detach().appendTo("body");
            } else if ($this.n.resultsAppend.length > 0) {
                $this.o.resultsposition = 'block';
                $this.n.resultsDiv.css({
                    'position': 'static'
                });
                $this.n.resultsDiv.detach().appendTo($this.n.resultsAppend);
            } else {
                $this.n.resultsDiv.detach().insertAfter($this.n.container);
            }

            if ($this.o.resultstype == 'horizontal') {
                $this.createHorizontalScroll();
            } else if ($this.o.resultstype == 'vertical') {
                $this.createVerticalScroll();
            }

            if ($this.o.resultstype == 'polaroid')
                $this.n.results.addClass('photostack');

            $this.monitorTouchMove();

            if (detectIE())
                $this.n.proloading.addClass('asp_msie');
            $this.initEvents();

            return this;
        },

        monitorTouchMove: function() {
            var $this = this;
            $this.dragging = false;
            $("body").on("touchmove", function(){
                $this.dragging = true;
            });
            $("body").on("touchstart", function(){
                $this.dragging = false;
            });
        },

        duplicateCheck: function() {
            var $this = this;
            var duplicateChk = {};

            $('div[id*=ajaxsearchpro]').each (function () {
                if (duplicateChk.hasOwnProperty(this.id)) {
                    $(this).remove();
                } else {
                    duplicateChk[this.id] = 'true';
                }
            });
        },

        analytics: function(term) {
            var $this = this;
            if ($this.o.analytics && $this.o.analyticsString != '' &&
                typeof ga == "function") {
                ga('send', 'pageview', {
                    'page': '/' + $this.o.analyticsString.replace("{asp_term}", term),
                    'title': 'Ajax Search'
                });
            }
        },

        createVerticalScroll: function () {
            var $this = this;
            $this.scroll = $this.n.results.mCustomScrollbar({
                contentTouchScroll: true,
                scrollButtons: {
                    enable: true,
                    scrollType: "pixels",
                    scrollSpeed: $this.o.resultitemheight,
                    scrollAmount: $this.o.resultitemheight
                },
                callbacks: {
                    onScroll: function () {
                        if (is_touch_device()) return;
                        var top = parseInt($('.mCSB_container', $this.n.results).position().top);
                        var children = $('.mCSB_container .resdrg').children();
                        var overall = 0;
                        var prev = 3000;
                        var diff = 4000;
                        var s_diff = 10000;
                        var s_overall = 10000;
                        var $last = null;
                        children.each(function () {
                            diff = Math.abs((Math.abs(top) - overall));
                            if (diff < prev) {
                                s_diff = diff;
                                s_overall = overall;
                                $last = $(this);
                            }
                            overall += $(this).outerHeight(true);
                            prev = diff;
                        });
                        if ($last.hasClass('group'))
                            s_overall = s_overall + ($last.outerHeight(true) - $last.outerHeight(false));
                        $(".mCSB_container", $this.n.resultsDiv).animate({
                            top: -s_overall
                        });
                    }
                }
            });

        },

        createHorizontalScroll: function () {
            var $this = this;

            $this.scroll = $this.n.results.mCustomScrollbar({
                horizontalScroll: true,
                contentTouchScroll: true,
                scrollButtons: {
                    enable: true,
                    scrollType: 'pixels',
                    scrollSpeed: 'auto',
                    scrollAmount: 100
                }
            });

        },

        initEvents: function () {
            var $this = this;

            $($this.n.text.parent()).submit(function (e, args) {
                e.preventDefault();
                if (is_touch_device() || (typeof(args) != 'undefined' && args == 'ajax') )
                    $this.search();
            });
            /*
            $this.n.text.click(function () {
                if ($this.firstClick) {
                    $(this).val('');
                    $this.firstClick = false;
                }
            });*/
            $this.n.resultsDiv.css({
                opacity: 0
            });
            $(document).bind("click touchend", function () {
                if ($this.o.blocking == false) $this.hideSettings();

                if ($this.o.compact.enabled) {
                    var compact = $this.n.container.attr('asp-compact')  || 'closed';
                    if ($this.o.compact.closeOnDocument == 1 && compact == 'open' && !$this.resultsOpened) {
                        $this.n.promagnifier.click();
                    }
                } else {
                    if ($this.resultsOpened == false || $this.o.closeOnDocClick != 1) return;
                }

                if (!$this.dragging) {
                    $this.hideResults();
                }
            });
            $this.n.proclose.bind("click touchend", function () {
                if ($this.resultsOpened == false) return;
                $this.n.text.val("");
                $this.n.textAutocomplete.val("");
                $this.hideResults();
            });
            $($this.elem).bind("click touchend", function (e) {
                e.stopImmediatePropagation();
            });
            $this.n.resultsDiv.bind("click touchend", function (e) {
                e.stopImmediatePropagation();
            });
            $this.n.searchsettings.bind("click touchend", function (e) {
                e.stopImmediatePropagation();
            });
            $('p.asp-try').bind("click touchend", function (e) {
                e.stopImmediatePropagation();
            });

            $this.n.prosettings.on("click", function () {
                if ($this.n.prosettings.data('opened') == 0) {
                    $this.showSettings();
                } else {
                    $this.hideSettings();
                }
            });

            if ($this.o.settingsVisible == 1) {
                $this.n.prosettings.click();
            }

            // jQuery bind not working!
            $(document).bind('touchmove', function (e) {
                if ($this.disableMobileScroll == true)
                    e.preventDefault();
            });

            $(window).bind("resize", function () {
                $this.resize();
            });
            $(window).bind("scroll", function () {
                $this.scrolling(false);
            });


            $this.initNavigationEvent();

            $(window).trigger('resize');
            $(window).trigger('scroll');

            if ($this.o.aapl.on_click == 1) {
                jQuery('div[id*=ajaxsearchprores'+ $this.o.id +'_] .results').on('click', '.item', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof(window.event)!='undefined' && typeof(window.event.cancelBubble) != 'undefined')
                        window.event.cancelBubble = true;
                    AAPL_loadPage(jQuery(this).find('a').attr('href'));
                });
            }

            $this.initMagnifierEvent();
            $this.initAutocompleteEvent();
            $this.initPagerEvent();
            $this.initOverlayEvent();
            $this.initFacetEvents();

        },

        initNavigationEvent: function () {
            var $this = this;

            $($this.n.resultsDiv).on('mouseenter', '.item',
                function () {
                    //alert("hover");
                    $('.item', $this.n.resultsDiv).removeClass('hovered');
                    $(this).addClass('hovered');
                }
            );
            $($this.n.resultsDiv).on('mouseleave', '.item',
                function () {
                    //alert("hover");
                    $('.item', $this.n.resultsDiv).removeClass('hovered');
                }
            );

            $(document).keydown(function (e) {

                if (window.event) {
                    var keycode = window.event.keyCode;
                    var ktype = window.event.type;
                } else if (e) {
                    var keycode = e.which;
                    var ktype = e.type;
                }
                //$('.item', $this.n.resultsDiv).hover();

                if ($('.item', $this.n.resultsDiv).length > 0 && $this.n.resultsDiv.css('display') != 'none') {
                    if (keycode == 40) {
                        e.stopPropagation();
                        e.preventDefault();
                        if ($this.post != null) $this.post.abort();
                        if ($('.item.hovered', $this.n.resultsDiv).length == 0) {
                            $('.item', $this.n.resultsDiv).first().addClass('hovered');
                            return;
                        }
                        $('.item.hovered', $this.n.resultsDiv).removeClass('hovered').next().addClass('hovered');
                        $this.scroll.mCustomScrollbar("scrollTo", ".resdrg .item.hovered");
                    }
                    if (keycode == 38) {
                        e.stopPropagation();
                        e.preventDefault();
                        if ($this.post != null) $this.post.abort();
                        if ($('.item.hovered', $this.n.resultsDiv).length == 0) {
                            $('.item', $this.n.resultsDiv).last().addClass('hovered');
                            return;
                        }
                        $('.item.hovered', $this.n.resultsDiv).removeClass('hovered').prev().addClass('hovered');
                        $this.scroll.mCustomScrollbar("scrollTo", ".resdrg .item.hovered");
                    }
                }
            });
        },

        initMagnifierEvent: function () {
            var $this = this;

            if ($this.o.compact.enabled == 1)
                $this.initCompactEvents();

            var t;
            $this.n.promagnifier.add($this.n.text).bind('click keyup', function (e) {
                if (window.event) {
                    $this.keycode = window.event.keyCode;
                    $this.ktype = window.event.type;
                } else if (e) {
                    $this.keycode = e.which;
                    $this.ktype = e.type;
                }                
                if ($this.keycode == 40 || $this.keycode == 38) return;
                if ($(this).hasClass('orig') && $this.ktype == 'click') return;

                // Click on magnifier in opened compact mode, when closeOnMagnifier enabled
                if (
                        $this.o.compact.enabled == 1 &&
                        ($this.ktype == 'click' || $this.ktype == 'touchend') &&
                        $this.o.compact.closeOnMagnifier == 1
                ) return;

                // Click on magnifier in closed compact mode, when closeOnMagnifier disabled
                var compact = $this.n.container.attr('asp-compact')  || 'closed';
                if (
                    $this.o.compact.enabled == 1 &&
                    ($this.ktype == 'click' || $this.ktype == 'touchend') &&
                    compact == 'closed'
                ) return;

                // AAPL on enter
                if (
                    $this.ktype == 'keyup' && $this.o.aapl.on_typing == 1 && typeof(AAPL_loadPage) != 'undefined'
                    ) {
                    clearTimeout(t);
                    $this.aaplResults();
                    return;
                }

                // AAPL on magnifier
                if ($this.ktype == 'click'
                    && $(this).hasClass('promagnifier')
                    && $this.o.aapl.on_magnifier == 1
                    && typeof(AAPL_loadPage)) {
                    clearTimeout(t);
                    $this.aaplResults();
                    return;
                }
                // AAPL on enter
                if (
                    $this.ktype == 'keyup' && $this.keycode == 13 &&
                    $this.o.aapl.on_enter == 1 && typeof(AAPL_loadPage) != 'undefined'
                    ) {
                    clearTimeout(t);
                    $this.aaplResults();
                    return;
                }

                if (
                        $this.n.text.val() != '' && (
                            ($this.o.redirectonclick == 1 && $this.ktype == 'click') ||
                            ($this.o.redirect_on_enter == 1 && $this.ktype == 'keyup' && $this.keycode == 13)
                        )
                    ) {
                    var plus = '';
                    var url = $this.o.redirect_url.replace('{phrase}', $this.n.text.val());

                    if (typeof(AAPL_loadPage) != 'undefined') {
                        var plus = '';
                        if ($this.o.overridewpdefault) {
                            plus = 'asid='+$this.o.id + '&' + $('form', $this.n.searchsettings).serialize();
                            plus = '&asp_data=' + Base64.encode(plus);
                        }
                        location.href = $this.o.homeurl + url + plus;
                    } else {
                        if ($this.o.overridewpdefault) {
                            asp_submit_to_url($this.o.homeurl + url, 'post', {
                                p_asid: $this.o.id,
                                p_asp_data: $('form', $this.n.searchsettings).serialize()
                            });
                        } else {
                            location.href = $this.o.homeurl + url;
                        }
                    }
                    return;
                }
                if ($this.o.triggeronclick == 0 && $this.ktype == 'click') {
                    return;
                }

                if ($this.ktype == 'keyup') {
                    if ($this.o.triggerontype == 0 && $this.keycode != '13')
                        return;
                    if ($this.o.triggeronreturn == 0 && $this.keycode == '13')
                        return;
                }

                //if (($this.o.triggerontype == 0 && $this.ktype == 'keyup') || ($this.ktype == 'keyup' && is_touch_device())) return;

                if ($this.n.text.val().length < $this.o.charcount) {
                    $this.n.proloading.css('display', 'none');
                    if ($this.o.blocking == false) $this.hideSettings();
                    $this.hideResults();
                    if ($this.post != null) $this.post.abort();
                    clearTimeout(t);
                    return;
                }
                
                if ($this.post != null) $this.post.abort();
                clearTimeout(t);
                $this.n.proloading.css('display', 'none');
                t = setTimeout(function () {
                    // If the user types and deletes, while the last results are open
                    if ($this.n.text.val() != $this.lastSuccesfulPhrase || !$this.resultsOpened)
                        $this.search();
                    else
                        $this.n.proclose.css('display', 'block');
                }, 250);
            });
        },

        initCompactEvents: function () {
            var $this = this;

            var scrollTopx = 0;
            $this.n.text.focus(function(){
                window.scrollTo(0, 0);
                document.body.scrollTop = scrollTopx;
                $this.n.container.css('top', $this.n.container.scrollTop);
                //$(this).n.container.css('z-index', 999999999999999999);
            });

            $this.n.probox.attr('asp-compact-w', $this.n.probox.width());
            $this.n.container.attr('asp-compact-w', $this.n.container.width());

            $this.n.promagnifier.click(function(){
                var compact = $this.n.container.attr('asp-compact')  || 'closed';

                scrollTopx = $(window).scrollTop();
                $this.hideSettings();
                $this.hideResults();

                if (compact == 'closed') {
                    $this.n.probox.css({width: "auto"});
                    $this.n.container.animate({width: $this.o.compact.width}, {
                        duration:150,
                        complete: function() {
                            $this.resize();
                            if ($this.n.container.css('position') != 'static') {
                                $this.n.trythis.css({
                                    display: 'block'
                                });
                            }
                        }
                    });
                    $this.n.container.attr('asp-compact', 'open');
                } else {
                    if ($this.o.compact.closeOnMagnifier != 1) return;

                    $this.n.container.css({width: "auto"});
                    $this.n.probox.animate({width: $this.n.probox.attr('asp-compact-w')}, 150);
                    //$this.n.container.animate({width: $this.n.container.attr('asp-compact-w')}, 300);
                    if ($this.n.container.css('position') != 'static') {
                        $this.n.trythis.css({
                            left: $this.n.container.position().left,
                            display: "none"
                        });
                    }
                    $this.n.container.attr('asp-compact', 'closed');
                }
            });

        },

        initAutocompleteEvent: function () {
            var $this = this;

            var tt;
            if ($this.o.autocomplete == 1 && !is_touch_device()) {
                $this.n.text.keydown(function (e) {
                    if (window.event) {
                        $this.keycode = window.event.keyCode;
                        $this.ktype = window.event.type;
                    } else if (e) {
                        $this.keycode = e.which;
                        $this.ktype = e.type;
                    }

                    var thekey = 39;
                    // Lets change the keykode if the direction is rtl
                    if ($('body').hasClass('rtl'))
                        thekey = 37;
                    if ($this.keycode == thekey && $this.n.textAutocomplete.val() != "") {
                        $this.n.text.val($this.n.textAutocomplete.val());
                    } else {
                        clearTimeout(tt);
                        if ($this.postAuto != null) $this.postAuto.abort();
                        tt = setTimeout(function () {
                            $this.autocomplete();
                            tt = null;
                        }, 30);
                    }
                });
            }
        },

        initPagerEvent: function () {
            var $this = this;
            $this.n.resultsDiv.on('click', 'nav>a', function (e) {
                e.preventDefault();
                if ($(this).hasClass('asp_prev')) {
                    $this.currentPage = $this.currentPage == 1 ? Math.ceil($this.n.items.length / $this.il.itemsPerPage) : --$this.currentPage;
                } else {
                    $this.currentPage = $this.currentPage == Math.ceil($this.n.items.length / $this.il.itemsPerPage) ? 1 : ++$this.currentPage;
                }
                $('nav>ul li', $this.n.resultsDiv).removeClass('asp_active');
                $($('nav>ul li', $this.n.resultsDiv).get($this.currentPage - 1)).addClass('asp_active');
                $this.isotopic.arrange({filter: $this.filterFns['number']});
                $this.removeAnimation();
            });
            $this.n.resultsDiv.on('click', 'nav>ul li', function (e) {
                e.preventDefault();
                $this.currentPage = parseInt($('span', this).html(), 10);
                $('nav>ul li', $this.n.resultsDiv).removeClass('asp_active');
                $($('nav>ul li', $this.n.resultsDiv).get($this.currentPage - 1)).addClass('asp_active');
                $this.isotopic.arrange({filter: $this.filterFns['number']});
                $this.removeAnimation();
            });
        },

        initOverlayEvent: function () {
            var $this = this;

            if ($this.o.resultstype == "isotopic") {
                if ($this.o.iishowOverlay) {
                    $this.n.resultsDiv.on('mouseenter', 'div.item', function (e) {
                        $('.asp_item_overlay', this).fadeIn();
                        if ($(".asp_item_img", this).length>0) {
                            if ($this.o.iiblurOverlay)
                                $('.asp_item_overlay_img', this).fadeIn();
                            if ($this.o.iihideContent)
                                $('.content', this).slideUp(100);
                        }
                    });
                    $this.n.resultsDiv.on('mouseleave', 'div.item', function (e) {
                        $('.asp_item_overlay', this).fadeOut();
                        if ($(".asp_item_img", this).length>0) {
                            if ($this.o.iiblurOverlay)
                                $('.asp_item_overlay_img', this).fadeOut();
                            if ($this.o.iihideContent && $(".asp_item_img", this).length>0)
                                $('.content', this).slideDown(100);
                        }
                    });
                    $this.n.resultsDiv.on('mouseenter', 'div.asp_item_inner', function (e) {
                        $(this).addClass('animated pulse');
                    });
                    $this.n.resultsDiv.on('mouseleave', 'div.asp_item_inner', function (e) {
                        $(this).removeClass('animated pulse');
                    });

                    $this.n.resultsDiv.on('click', '.asp_item_overlay', function(){
                        var url = $('.content h3 a', $(this).parent()).attr('href');
                        window.location = url;
                    });
                }

                $(window).on('resize', function () {
                    if ($this.resizeTimeout != null) clearTimeout($this.resizeTimeout);
                    $this.resizeTimeout = setTimeout(function () {
                        $this.calculateIsotopeRows();
                        $this.showPagination();
                        $this.removeAnimation();
                        if ($this.isotopic != null)
                            $this.isotopic.arrange({filter: $this.filterFns['number']});
                    }, 200);
                });
            }

        },

        initFacetEvents: function() {
            var $this = this;

            if ($this.o.triggerOnFacetChange == 0) return;
            $('input', $this.n.searchsettings).change(function(){
                if ($this.n.text.val().length < $this.o.charcount) return;
                if ($this.post != null) $this.post.abort();
                $this.search();
            });
        },

        destroy: function () {
            return this.each(function () {
                var $this = $.extend({}, this, methods);
                $(window).unbind($this);
            })
        },
        searchfor: function (phrase) {
            $(".proinput input", this).val(phrase).trigger("keyup");
        },
        autocomplete: function () {
            var $this = this;

            var val = $this.n.text.val();
            if ($this.n.text.val() == '') {
                $this.n.textAutocomplete.val('');
                return;
            }
            var autocompleteVal = $this.n.textAutocomplete.val();
            if (autocompleteVal != '' && autocompleteVal.indexOf(val) == 0) {
                return;
            } else {
                $this.n.textAutocomplete.val('');
            }
            var data = {
                action: 'ajaxsearchpro_autocomplete',
                asid: $this.o.id,
                sauto: $this.n.text.val()
            };
            $this.postAuto = $.post(ajaxsearchpro.ajaxurl, data, function (response) {
                if (response.length > 0) {
                    var part1 = val;
                    var part2 = response.substr(val.length);
                    response = part1 + part2;
                }
                $this.n.textAutocomplete.val(response);
            });
        },
        search: function () {
            var $this = this;

            if ($this.searching && 0) return;

            $this.searching = true;
            $this.n.proloading.css({
                display: "block"
            });
            $this.n.proclose.css({
                display: "none"
            });
            if ($this.o.blocking == false) $this.hideSettings();
            // Removed in 4.0, better visual experience
            //$this.hideResults();

            var asp_preview_options = 0;
            if ($('#asp_preview_options').length > 0)
                asp_preview_options = $('#asp_preview_options').html();

            var data = {
                action: 'ajaxsearchpro_search',
                aspp: $this.n.text.val(),
                asid: $this.o.id,
                asp_inst_id: $this.o.rid,
                options: $('form', $this.n.searchsettings).serialize(),
                asp_preview_options: asp_preview_options
            };
            $this.analytics($this.n.text.val());
            $this.post = $.post(ajaxsearchpro.ajaxurl, data, function (response) {
                response = response.replace(/^\s*[\r\n]/gm, "");
                response = response.match(/!!ASPSTART!!(.*[\s\S]*)!!ASPEND!!/)[1];

                // bye bye JSON

                $this.n.resdrg.html("");
                $this.n.resdrg.html(response);

                $(".asp_keyword", $this.n.resdrg).bind('click', function () {
                    $this.n.text.val($(this).html());
                    $('input.orig', $this.n.container).val($(this).html()).keydown();
                    $('form', $this.n.container).trigger('submit', 'ajax');
                });
                $this.n.items = $('.item', $this.n.resultsDiv);

                $this.showResults();
                $this.scrollToResults();
                $this.lastSuccesfulPhrase = $this.n.text.val();

                if ($this.n.showmore != null) {
                    var url = $this.o.more_redirect_url.replace('{phrase}', $this.n.text.val());
                    // we must fall back to get if AAPL is active..
                    if (typeof(AAPL_loadPage) != 'undefined') {
                        var plus = '';
                        if ($this.o.overridewpdefault) {
                             plus = 'asid='+$this.o.id + '&' + $('form', $this.n.searchsettings).serialize();
                             plus = '&asp_data=' + Base64.encode(plus);
                        }
                        $('a', $this.n.showmore).attr('href', $this.o.homeurl + url + plus);
                    } else {
                        $('a', $this.n.showmore).attr('href', "#");
                        $('a', $this.n.showmore).click(function(e){
                            e.preventDefault();
                            asp_submit_to_url($this.o.homeurl + url, 'post', {
                                p_asid: $this.o.id,
                                p_asp_data: $('form', $this.n.searchsettings).serialize()
                            });
                        });
                    }
                }
            }, "text");
        },

        aaplResults: function( ) {
            var $this = this;
            var plus = '';
            // AAPL on enter
            if ($this.post != null) $this.post.abort();
            $this.n.proloading.css('display', 'none');
            if ($this.o.blocking == false) $this.hideSettings();
            $this.hideResults();

            var url = $this.o.redirect_url.replace('{phrase}', $this.n.text.val());
            if ($this.o.overridewpdefault)
                plus = 'asid='+$this.o.id + '&' + $('form', $this.n.searchsettings).serialize();
            if (plus != '')
                AAPL_loadPage($this.o.homeurl + url + '&asp_data=' + Base64.encode(plus));
            else
                AAPL_loadPage($this.o.homeurl + url);
            return;
        },

        showResults: function( ) {
            var $this = this;
            switch ($this.o.resultstype) {
                case 'horizontal':
                    $this.showHorizontalResults();
                    break;
                case 'vertical':
                    $this.showVerticalResults();
                    break;
                case 'polaroid':
                    $this.showPolaroidResults();
                    $this.disableMobileScroll = true;
                    break;
                case 'isotopic':
                    $this.showIsotopicResults();
                    break;
                default:
                    $this.showHorizontalResults();
                    break;
            }
            $this.n.proloading.css({
                display: "none"
            });
            $this.n.proclose.css({
                display: "block"
            });
            if ($this.n.showmore != null) {
                $this.n.showmore.css({
                    'display': 'block'
                });
            }
            if (is_touch_device())
                document.activeElement.blur();
            $this.resultsOpened = true;
        },

        hideResults: function( ) {
            var $this = this;
            switch ($this.o.resultstype) {
                case 'horizontal':
                    $this.hideHorizontalResults();
                    break;
                default:
                    $this.hideVerticalResults()
                    break;
            }
            $this.n.proclose.css({
                display: "none"
            });
            if ($this.n.showmore != null) {
                $this.n.showmore.css({
                    'display': 'none'
                });
            }
            $this.resultsOpened = false;
        },


        scrollToResults: function( ) {
            $this = this;
            if (this.o.scrollToResults!=1) return;
            if (this.$elem.parent().hasClass("asp_preview_data")) return;
            if ($this.o.resultsposition == "hover")
              var stop = $this.n.probox.offset().top - 20;
            else
              var stop = $this.n.resultsDiv.offset().top - 20;
            if ($("#wpadminbar").length > 0)
                stop -= $("#wpadminbar").height();
            stop = stop < 0 ? 0 : stop;
            $('body, html').animate({
                "scrollTop": stop
            }, {
                duration: 500
            });
        },

        showVerticalResults: function () {
            var $this = this;
            $this.n.resultsDiv.css({
                display: 'block',
                height: 'auto'
            });
            $this.scrolling(true);
            var top = $this.n.resultsDiv.position().top;
            $this.n.resultsDiv.css({
                "top": top - 100,
                opacity: 0,
                visibility: "visible"
            }).animate({
                    "top": top,
                    opacity: 1
                }, {
                    complete: function () {
                        $(".mCS_no_scrollbar", $this.n.resultsDiv).css({
                            "top": 0
                        });
                        $(".mCSB_container", $this.n.resultsDiv).css({
                            "top": 0
                        });
                    }
                });
            if ($this.n.items.length > 0) {
                var count = (($this.n.items.length < $this.o.itemscount) ? $this.n.items.length : $this.o.itemscount);
                var groups = $('.group', $this.n.resultsDiv);
                var i = 0;
                var h = 0;
                $this.n.items.each(function () {
                    h += $(this).outerHeight(true);
                    i++;
                });
                // Count the average height * viewport size
                i = i < 1 ? 1 : i;
                h = h/i * count;
                if (groups.length > 0) {
                    h += groups.outerHeight(true);
                }
                $this.n.results.css({
                    height: h + 3
                });
                $this.scroll.mCustomScrollbar('update');
                if ($this.o.highlight == 1) {
                    var wholew = (($this.o.highlightwholewords == 1) ? true : false);
                    $("div.item", $this.n.resultsDiv).highlight($this.n.text.val().split(" "), { element: 'span', className: 'highlighted', wordsOnly: wholew });
                }

            }
            $this.resize();
            if ($this.n.items.length == 0) {
                var h = ($('.nores', $this.n.results).outerHeight(true) > ($this.o.resultitemheight) ? ($this.o.resultitemheight) : $('.nores', $this.n.results).outerHeight(true));
                $this.n.results.css({
                    height: 11110
                });
                $this.scroll.mCustomScrollbar('update');
                $this.n.results.css({
                    height: 'auto'
                });
            }
            $this.addAnimation();
            $this.scrolling(true);
            $this.searching = false;

        },

        showHorizontalResults: function () {
            var $this = this;

            $this.n.resultsDiv.css('display', 'block');

            if ($('.nores', $this.n.results).size() > 0) {
                $(".mCSB_container", $this.n.resultsDiv).css({
                    width: 'auto',
                    left: 0
                });
            } else {
                $(".mCSB_container", $this.n.resultsDiv).css({
                    width: ($this.n.resdrg.children().size() * $($this.n.resdrg.children()[0]).outerWidth(true)),
                    left: 0
                });
            }
            if ($this.o.resultsposition == 'hover')
                $this.n.resultsDiv.css('width', $this.n.container.outerWidth(true));
            $this.scroll.data({
                "scrollButtons_scrollAmount": parseInt($this.n.items.outerWidth(true)),
                "mouseWheelPixels": parseInt($this.n.items.outerWidth(true))
            }).mCustomScrollbar("update");

            if ($this.n.resultsDiv.css('visibility') == 'visible') {
                var cssArgs = {
                    height: 'auto'
                };
                var animArgs = {
                    opacity: 1
                };
            } else {
                var autoHeight = $this.n.resultsDiv.css('height', 'auto').height();

                var cssArgs = {
                    opacity: 0,
                    visibility: "visible",
                    height: 0
                };

                var animArgs = {
                    opacity: 1,
                    height: autoHeight
                };
            }

            $this.addAnimation();

            $this.n.resultsDiv.css(cssArgs).animate(
                animArgs
                , {
                    complete: function () {
                        $this.scrolling(true);
                        $this.searching = false;
                    }
                });
        },

        showIsotopicResults: function () {
            var $this = this;
            var itemsPerPage = $this.o.iitemsPerPage;

            $this.preProcessIsotopicResults();
            $this.n.resultsDiv.css({
                display: 'block',
                height: 'auto'
            });
            $this.scrolling(true);
            var top = $this.n.resultsDiv.position().top;
            $this.n.resultsDiv.css({
                "top": top - 100,
                opacity: 0,
                visibility: "visible"
            }).animate({
                    "top": top,
                    opacity: 1
                }, {

                });
            if ($this.n.items.length > 0) {
                $this.n.results.css({
                    height: "auto"
                });
                if ($this.o.highlight == 1) {
                    var wholew = (($this.o.highlightwholewords == 1) ? true : false);
                    $("div.item", $this.n.resultsDiv).highlight($this.n.text.val().split(" "), { element: 'span', className: 'highlighted', wordsOnly: wholew });
                }

            }

            $this.calculateIsotopeRows();
            $this.showPagination();
            if ($this.n.items.length == 0) {
                var h = ($('.nores', $this.n.results).outerHeight(true) > ($this.o.resultitemheight) ? ($this.o.resultitemheight) : $('.nores', $this.n.results).outerHeight(true));
                $this.n.results.css({
                    height: 11110
                });
                $this.n.results.css({
                    height: 'auto'
                });
                $this.n.resdrg.css({
                    height: 'auto'
                });
            } else {
                $this.isotopic = new rpp_isotope('#ajaxsearchprores' + $this.o.rid + " .resdrg", {
                    // options
                    itemSelector: 'div.item',
                    layoutMode: 'masonry',
                    filter: $this.filterFns['number']
                });
            }
            $this.addAnimation();
            $this.searching = false;
        },

        preProcessIsotopicResults: function() {
            var $this = this;
            var j = 0;
            var overlay = "";

            if ($this.o.iishowOverlay)
                overlay = $this.n.aspItemOverlay[0].outerHTML;

            $.grep($this.n.items, function (el, i) {
                var image = "";
                var overlayImage = "";
                var hasImage = $('.asp_item_img', el).length > 0 ? true : false;
                var $img = $('.asp_item_img', el);

                if (hasImage) {
                    var src = $img.attr('src');
                    if ($this.o.iiblurOverlay && !is_touch_device())
                        var filter = "aspblur";
                    else
                        var filter = "no_aspblur";
                    overlayImage = "<img filter='url(#" + filter + ")' style='filter: url(#" + filter + ");-webkit-filter: url(#" + filter + ");-moz-filter: url(#" + filter + ");-o-filter: url(#" + filter + ");-ms-filter: url(#" + filter + ");' class='asp_item_overlay_img' src=' " + src + "'>";
                } else {
                    switch ($this.o.iifNoImage) {
                        case "description":
                            break;
                        case "removeres":
                            return false;
                            break;
                        case "defaultimage":
                            if ($this.o.defaultImage != "") {
                                image = "<img class='asp_item_img' src=' " + $this.o.defaultImage + "'>";
                                if ($this.o.iiblurOverlay && !is_touch_device())
                                    var filter = "aspblur";
                                else
                                    var filter = "no_aspblur";
                                overlayImage = "<img filter='url(#" + filter + ")' style='filter: url(#" + filter + ");-webkit-filter: url(#" + filter + ");-moz-filter: url(#" + filter + ");-o-filter: url(#" + filter + ");-ms-filter: url(#" + filter + ");' class='asp_item_overlay_img' src=' " + $this.o.defaultImage + "'>";
                            }
                            break;
                    }
                }

                $(overlayImage + overlay + image).prependTo(el);
                $(el).attr('data-itemnum', j);

                j++;
            });

        },


        showPagination: function () {
            var $this = this;

            $('nav.asp_navigation ul li', $this.n.resultsDiv).remove();
            $('nav.asp_navigation', $this.n.resultsDiv).css('display', 'none');

            if ($this.n.items.length > 0) {
                var pages = Math.ceil($this.n.items.length / $this.il.itemsPerPage);
                if (pages > 1) {
                    for (var i = 1; i <= pages; i++) {
                        if (i == 1)
                            $('nav.asp_navigation ul', $this.n.resultsDiv).append("<li class='asp_active'><span>" + i + "</span></li>");
                        else
                            $('nav.asp_navigation ul', $this.n.resultsDiv).append("<li><span>" + i + "</span></li>");
                    }
                    $('nav.asp_navigation', $this.n.resultsDiv).css('display', 'block');
                }
            }
        },


        calculateIsotopeRows: function () {
            var $this = this;
            var containerWidth = parseFloat($this.n.results.innerWidth());
            var realColumnCount = containerWidth / $this.o.iitemsWidth;
            var floorColumnCount = Math.floor(realColumnCount);
            if (floorColumnCount <= 0)
                floorColumnCount = 1;
            /*if ((realColumnCount - floorColumnCount) > 0.8)
             floorColumnCount++;*/
            if (Math.abs(containerWidth / floorColumnCount - $this.o.iitemsWidth) >
                Math.abs(containerWidth / (floorColumnCount + 1) - $this.o.iitemsWidth)) {
                floorColumnCount++;
            }

            var newItemW = containerWidth / floorColumnCount;
            var newItemH = (newItemW / $this.o.iitemsWidth) * $this.o.iitemsHeight;

            $this.il.columns = floorColumnCount;
            $this.il.itemsPerPage = floorColumnCount * $this.o.iiRows;

            // This data needs do be written to the DOM, because the isotope arrange can't see the changes
            $this.n.resultsDiv.data({
                "colums": $this.il.columns,
                "itemsperpage": $this.il.itemsPerPage
            });

            $this.currentPage = 1;

            $this.n.items.css({
                width: Math.floor(newItemW),
                height: Math.floor(newItemH)
            });
        },

        showPolaroidResults: function () {
            var $this = this;

            $('.photostack>nav', $this.n.resultsDiv).remove();
            var figures = $('figure', $this.n.resultsDiv);
            $this.n.resultsDiv.css({
                display: 'block',
                height: 'auto'
            });
            $this.scrolling(true);
            var top = $this.n.resultsDiv.position().top;
            $this.n.resultsDiv.css({
                "top": top - 100,
                opacity: 0,
                visibility: "visible"
            }).animate({
                    "top": top,
                    opacity: 1
                }, {
                    complete: function () {

                    }
                });

            if (figures.length > 0) {
                $this.n.results.css({
                    height: $this.o.prescontainerheight
                });

                if ($this.o.highlight == 1) {
                    var wholew = (($this.o.highlightwholewords == 1) ? true : false);
                    //$("div.item", $this.n.resultsDiv).highlight($this.n.text.val().split(" "), { element: 'span', className: 'highlighted', wordsOnly: wholew });
                    //TODO
                }
                new Photostack($this.n.results.get(0), {
                    callback: function (item) {
                    }
                });
            }
            //$this.resize();
            if (figures.length == 0) {
                var h = ($('.nores', $this.n.results).outerHeight(true) > ($this.o.resultitemheight) ? ($this.o.resultitemheight) : $('.nores', $this.n.results).outerHeight(true));
                $this.n.results.css({
                    height: 11110
                });
                $this.n.results.css({
                    height: "auto"
                });
            }
            $this.addAnimation();
            $this.scrolling(true);
            $this.searching = false;
            $this.initPolaroidEvents(figures);


        },

        initPolaroidEvents: function (figures) {
            var $this = this;

            var i = 1;
            figures.each(function () {
                if (i > 1)
                    $(this).removeClass('photostack-current');
                $(this).attr('idx', i);
                i++;
            });

            figures.click(function (e) {
                if ($(this).hasClass("photostack-current")) return;
                e.preventDefault();
                var idx = $(this).attr('idx');
                $('.photostack>nav span:nth-child(' + idx + ')', $this.n.resultsDiv).click();
            });

            figures.bind('mousewheel', function (event, delta) {
                event.preventDefault();
                if (delta >= 1) {
                    if ($('.photostack>nav span.current', $this.n.resultsDiv).next().length > 0) {
                        $('.photostack>nav span.current', $this.n.resultsDiv).next().click();
                    } else {
                        $('.photostack>nav span:nth-child(1)', $this.n.resultsDiv).click();
                    }
                } else {
                    if ($('.photostack>nav span.current', $this.n.resultsDiv).prev().length > 0) {
                        $('.photostack>nav span.current', $this.n.resultsDiv).prev().click();
                    } else {
                        $('.photostack>nav span:nth-last-child(1)', $this.n.resultsDiv).click();
                    }
                }
            });

            figures.bind("swipeone", function (e, originalEvent) {
                e.preventDefault();
                e.stopPropagation();
                originalEvent.originalEvent.preventDefault();
                originalEvent.originalEvent.stopPropagation()
                if (originalEvent.delta != null && originalEvent.delta[0] != null && originalEvent.delta[0].lastX != null) {
                    if (originalEvent.delta[0].lastX >= 0) {
                        if ($('.photostack>nav span.current', $this.n.resultsDiv).next().length > 0) {
                            $('.photostack>nav span.current', $this.n.resultsDiv).next().click();
                        } else {
                            $('.photostack>nav span:nth-child(1)', $this.n.resultsDiv).click();
                        }
                    } else {
                        if ($('.photostack>nav span.current', $this.n.resultsDiv).prev().length > 0) {
                            $('.photostack>nav span.current', $this.n.resultsDiv).prev().click();
                        } else {
                            $('.photostack>nav span:nth-last-child(1)', $this.n.resultsDiv).click();
                        }
                    }
                }
            });
            $this.disableMobileScroll = true;
        },

        hideVerticalResults: function () {
            var $this = this;

            $this.disableMobileScroll = false;

            $this.n.resultsDiv
                .animate({
                    opacity: 0,
                    height: 0
                }, {
                    duration: 120,
                    complete: function () {
                        $(this).css({
                            visibility: "hidden",
                            display: "none"
                        });
                    }
                });
        },

        hideHorizontalResults: function (newSearch) {
            //var $this =  $.extend({}, this, methods);
            var $this = this;

            $this.disableMobileScroll = false;

            newSearch = typeof newSearch !== 'undefined' ? newSearch : false;
            if (!newSearch) {
                $this.n.resultsDiv
                    .animate({
                        opacity: 0,
                        height: 0
                    }, {
                        duration: 120,
                        complete: function () {
                            $(this).css({
                                visibility: "hidden",
                                display: "none"
                            });
                        }
                    });
            } else {
                $this.n.resultsDiv
                    .animate({
                        opacity: 0.3
                    }, {
                        complete: function () {
                            return;
                        }
                    });
            }
        },

        addAnimation: function () {
            var $this = this;
            var i = 0;
            var j = 1;
            $this.n.items.each(function () {
                if ($this.o.resultstype == 'isotopic' && j>$this.il.itemsPerPage)
                    return;
                var x = this;
                setTimeout(function () {
                    $(x).addClass($this.animation);
                }, i);
                i = i + 60;
                j++;
            });
        },

        removeAnimation: function () {
            var $this = this;
            $this.n.items.each(function () {
                var x = this;
                $(x).removeClass($this.animation);
            });
        },

        showSettings: function () {
            var $this = this;
            if ($this.o.blocking) {
                $this.n.searchsettings.css({
                   "display": "block",
                   "visibility": "visible"
                });
                $this.n.searchsettings.animate({
                    opacity: 1
                });
            } else {
                $this.scrolling(true);
                $this.n.searchsettings.css({
                    opacity: 0,
                    visibility: "visible",
                    top: "-=50px"
                });
                $this.n.searchsettings.animate({
                    opacity: 1,
                    top: "+=50px"
                });

                if ($this.settScroll == null) {
                    $this.settScroll = $('.asp_sett_scroll', $this.n.searchsettings).mCustomScrollbar({
                        contentTouchScroll: true
                    });
                }
            }
            $this.n.prosettings.data('opened', 1);
        },
        hideSettings: function () {
            var $this = this;
            if ($this.o.blocking) {
                $this.n.searchsettings.css({
                    "display": "none",
                    "visibility": "hidden"
                });
                $this.n.searchsettings.animate({
                    opacity: 0
                });
            } else {
                $this.n.searchsettings.animate({
                    opacity: 0
                }, {
                    complete: function () {
                        $(this).css({
                            visibility: "hidden"
                        });
                    }
                });
            }
            $this.n.prosettings.data('opened', 0);
        },
        cleanUp: function () {
            var $this = this;

            if ($('.searchsettings', $this.n.container).length > 0) {
                $('body>#ajaxsearchprosettings' + $this.o.rid).remove();
                $('body>#ajaxsearchprores' + $this.o.rid).remove();
            }
        },
        resize: function () {
            var $this = this;

            $this.n.proinput.css({
                width: ($this.n.probox.width() - 8 - ($this.n.proinput.outerWidth(false) - $this.n.proinput.width()) - $this.n.proloading.outerWidth(true) - $this.n.prosettings.outerWidth(true) - $this.n.promagnifier.outerWidth(true) - 10)
            });
            $this.n.text.css({
                width: $this.n.proinput.width() - 2 + $this.n.proloading.outerWidth(true),
                position: 'absolute',
                zIndex: 2
            });
            $this.n.textAutocomplete.css({
                width: $this.n.proinput.width() - 2 + $this.n.proloading.outerWidth(true),
                position: 'absolute',
                top: $this.n.text.position().top,
                left: $this.n.text.position().left,
                opacity: 0.25,
                zIndex: 1
            });

            if ($this.n.prosettings.data('opened') != 0) {

                if ($this.o.settingsimagepos == 'left') {
                    $this.n.searchsettings.css({
                        display: "block",
                        top: $this.n.prosettings.offset().top + $this.n.prosettings.height() - 2,
                        left: $this.n.prosettings.offset().left
                    });
                } else {
                    $this.n.searchsettings.css({
                        display: "block",
                        top: $this.n.prosettings.offset().top + $this.n.prosettings.height() - 2,
                        left: $this.n.prosettings.offset().left + $this.n.prosettings.width() - $this.n.searchsettings.width()
                    });
                }
            }
            if ($this.n.resultsDiv.css('visibility') != 'hidden') {

                if ($this.o.resultsposition != 'block') {
                    $this.n.resultsDiv.css({
                        width: $this.n.container.width() - ($this.n.resultsDiv.outerWidth(true) - $this.n.resultsDiv.width()),
                        top: $this.n.container.offset().top + $this.n.container.outerHeight(true) + 10,
                        left: $this.n.container.offset().left
                    });
                }

                if ($this.o.resultstype != 'isotopic') {
                    $('.content', $this.n.items).each(function () {
                        var imageWidth = (($(this).prev().css('display') == "none") ? 0 : $(this).prev().outerWidth(true));
                        $(this).css({
                            width: ($(this.parentNode).width() - $(this).prev().outerWidth(true) - $(this).outerWidth(false) + $(this).width()) - 3
                        });
                    });
                }

            }

            if ($this.n.container.css('position') == 'fixed') {
                $this.n.trythis.css({
                    top: $this.n.container.position().top + $this.n.container.outerHeight(true),
                });
            }
            $this.n.trythis.css({
                left: $this.n.container.position().left
            });
        },
        scrolling: function (ignoreVisibility) {
            var $this = this;

            if ( (ignoreVisibility == true || $this.n.searchsettings.css('visibility') == 'visible') && $this.o.blocking == false ) {
                if ($this.o.settingsimagepos == 'left') {
                    $this.n.searchsettings.css({
                        display: "block",
                        top: $this.n.prosettings.offset().top + $this.n.prosettings.height() - 2,
                        left: $this.n.prosettings.offset().left
                    });
                } else {
                    $this.n.searchsettings.css({
                        display: "block",
                        top: $this.n.prosettings.offset().top + $this.n.prosettings.height() - 2,
                        left: $this.n.prosettings.offset().left + $this.n.prosettings.width() - $this.n.searchsettings.width()
                    });
                }
            }

            if ((ignoreVisibility == true || $this.n.resultsDiv.css('visibility') == 'visible')) {
                var cwidth = $this.n.container.outerWidth(true);
                if ($this.o.resultsposition != 'hover' && $this.n.resultsAppend.length > 0)
                    cwidth = 'auto';
                else
                    cwidth = cwidth - (2 * parseInt($this.n.resultsDiv.css('paddingLeft')));
                $this.n.resultsDiv.css({
                    width: cwidth,
                    top: $this.n.container.offset().top + $this.n.container.outerHeight(true) + 10,
                    left: $this.n.container.offset().left
                });
                if ($this.o.resultstype != 'vertical') return;
                $('.content', $this.n.items).each(function () {
                    $(this).css({
                        width: ($(this.parentNode).width() - $(this).prev().outerWidth(true) - $(this).outerWidth(false) + $(this).width()) - 3
                    });
                    /*$(this).css({
                     width: ($(this.parentNode).width()-$(this).prev().outerWidth(true))
                     });*/
                });
            }
        }
    };

    function asp_submit_to_url(action, method, input) {
        'use strict';
        var form;
        form = $('<form />', {
            action: action,
            method: method,
            style: 'display: none;'
        });
        if (typeof input !== 'undefined' && input !== null) {
            $.each(input, function (name, value) {
                $('<input />', {
                    type: 'hidden',
                    name: name,
                    value: value
                }).appendTo(form);
            });
        }
        form.appendTo('body').submit();
    }

    function is_touch_device() {
        return !!("ontouchstart" in window) ? 1 : 0;
    }

    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');

        if (msie > 0 || trident > 0)
            return true;

        // other browser
        return false;
    }

    // Object.create support test, and fallback for browsers without it
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }


    // Create a plugin based on a defined object
    $.plugin = function (name, object) {
        $.fn[name] = function (options) {
            return this.each(function () {
                if (!$.data(this, name)) {
                    $.data(this, name, Object.create(object).init(
                        options, this));
                }
            });
        };
    };

    $.plugin('ajaxsearchpro', methods);

    jQuery.fn.animateAuto = function(prop, speed, callback){
        var elem, height, width;
        return this.each(function(i, el){
            el = jQuery(el), elem = el.clone().css({"height":"auto","width":"auto"}).appendTo("body");
            height = elem.css("height"),
                width = elem.css("width"),
                elem.remove();

            if(prop === "height")
                el.animate({"height":height}, speed, callback);
            else if(prop === "width")
                el.animate({"width":width}, speed, callback);
            else if(prop === "both")
                el.animate({"width":width,"height":height}, speed, callback);
        });
    }

    $.fn.mobileFix = function (options) {
        var $parent = $(this),
            $fixedElements = $(options.fixedElements);

        $(document)
            .on('focus', options.inputElements, function(e) {
                $parent.addClass(options.addClass);
            })
            .on('blur', options.inputElements, function(e) {
                $parent.removeClass(options.addClass);

                // Fix for some scenarios where you need to start scrolling
                setTimeout(function() {
                    $(document).scrollTop($(document).scrollTop())
                }, 1);
            });

        return this; // Allowing chaining
    };

    /**
     *
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    var Base64 = {

// private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

// public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

// private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

// private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }

})(jQuery);

})(aspjQuery, aspjQuery, window);