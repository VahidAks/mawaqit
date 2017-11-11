
/**
 * Douaa slider class
 * @type {Object}
 */
var douaaSlider = {
    oneDouaaShowingTime: 20000,
    /**
     * it saves html (ul,li)
     * @type String
     */
    sliderHtmlContent: '',
    /**
     *  init douaa after prayer slider
     */
    init: function () {
        // if mobile device ignore douaa slider
        if ($(window).width() < 1200) {
            return;
        }

        var screenWidth = $(window).width();
        $('.adhkar-after-prayer li').width(screenWidth);
        var slideCount = $('.adhkar-after-prayer li').length;
        var sliderUlWidth = slideCount * screenWidth;
        $('.adhkar-after-prayer').css({width: screenWidth});
        $('.adhkar-after-prayer ul').css({width: sliderUlWidth, marginLeft: -screenWidth});
        $('.adhkar-after-prayer li:last-child').prependTo('.adhkar-after-prayer ul');
        if (lang === "ar") {
            $(".adhkar-after-prayer .fr").remove();
        }
        //save html slider
        this.sliderHtmlContent = $('.adhkar-after-prayer').html();
    },
    /**
     * If enabled show douaa after prayer for 5 minutes
     * @param {Number} currentTimeIndex
     */
    show: function (currentTimeIndex) {
        if (prayer.confData.duaAfterPrayerEnabled === true && !prayer.isJumua(currentTimeIndex)) {
            $(".main").fadeOut(1000, function () {
                $(".adhkar-after-prayer").fadeIn(1000);
                douaaSlider.setFontSize();
            });

            var douaaInterval = setInterval(function () {
                douaaSlider.moveRight();
            }, douaaSlider.oneDouaaShowingTime);

            setTimeout(function () {
                clearInterval(douaaInterval);
                $(".adhkar-after-prayer").fadeOut(1000, function () {
                    $(".main").fadeIn(1000);
                    $('.adhkar-after-prayer').html(douaaSlider.sliderHtmlContent);
                });

                // show messages if exist after 5 sec after duaa
                setTimeout(function () {
                    messageInfoSlider.get();
                }, 5 * prayer.oneSecond);

            }, douaaSlider.getTimeForShow());
        } else {
            // show messages if exist after prayer
            setTimeout(function () {
                messageInfoSlider.get();
            }, 5 * prayer.oneSecond);
        }
    },
    timeout: function (currentTimeIndex) {
        setTimeout(function () {
            douaaSlider.show(currentTimeIndex);
        }, prayer.confData.duaAfterPrayerShowTimes[currentTimeIndex] * prayer.oneMinute);
    },
    /**
     * Number of seconds to show all douaa
     * @returns {Number}
     */
    getTimeForShow: function () {
        return ($('.adhkar-after-prayer li').length * douaaSlider.oneDouaaShowingTime) - 1000;
    },
    moveRight: function () {
        var screenWidth = $(window).width();
        $('.adhkar-after-prayer ul').animate({
            left: -screenWidth
        }, 1000, function () {
            $('.adhkar-after-prayer li:first-child').appendTo('.adhkar-after-prayer ul');
            $('.adhkar-after-prayer ul').css('left', '');
        });
    },
    setFontSize: function () {
        var $body = $('body');
        $('.slider li').each(function (i, slide) {
            var $slide = $(slide);
            $slide.css('font-size', '200px');
            while ($slide.height() > $body.height() - 50) {
                $slide.css('font-size', (parseInt($slide.css('font-size')) - 1) + "px");
            }
        });
    }
};

/**
 * Messages slider class
 * @type {Object}
 */
var messageInfoSlider = {
    oneMessageShowingTime: 30000,
    /**
     * it saves html (ul,li)
     * @type String
     */
    sliderHtmlContent: '',
    /**
     *  run message slider
     */
    run: function () {
        messageInfoSlider.messageInfoIsShowing = true;
        var screenWidth = $(window).width();
        var nbSlides = $('.message-info-slider li').length;

        $('.message-info-slider li').width(screenWidth);

        if (nbSlides === 1) {
            setTimeout(function () {
                $(".message-info-slider").fadeOut(1000, function () {
                    $(".main").fadeIn(1000);
                });
                messageInfoSlider.messageInfoIsShowing = false;
            }, messageInfoSlider.oneMessageShowingTime);
        }

        if (nbSlides === 2) {
            $(".message-info-slider li").hide();
            $(".message-info-slider li:eq(0)").show();

            setTimeout(function () {
                $(".message-info-slider li:eq(0)").hide(1000, function () {
                    $(".message-info-slider li:eq(1)").show(1000);
                });
            }, messageInfoSlider.oneMessageShowingTime);

            setTimeout(function () {
                $(".message-info-slider").fadeOut(1000, function () {
                    $(".main").fadeIn(1000);
                });
                messageInfoSlider.messageInfoIsShowing = false;
            }, messageInfoSlider.oneMessageShowingTime * 2);
        }

        if (nbSlides > 2) {
            var sliderUlWidth = nbSlides * screenWidth;
            $('.message-info-slider ul').css({width: sliderUlWidth, marginLeft: -screenWidth});
            $('.message-info-slider li:last-child').prependTo('.message-info-slider ul');

            //save html slider
            messageInfoSlider.sliderHtmlContent = $('.message-info-slider').html();

            var interval = setInterval(function () {
                messageInfoSlider.moveRight();
            }, messageInfoSlider.oneMessageShowingTime);

            setTimeout(function () {
                clearInterval(interval);
                $(".message-info-slider").fadeOut(1000, function () {
                    $(".main").fadeIn(1000);
                    $('.message-info-slider').html(messageInfoSlider.sliderHtmlContent);
                });
                messageInfoSlider.messageInfoIsShowing = false;
            }, (nbSlides * messageInfoSlider.oneMessageShowingTime) - 1000);
        }

        $(".main").fadeOut(1000, function () {
            $(".message-info-slider").fadeIn(1000);
            messageInfoSlider.setFontSize();
        });
    },
    /**
     * Get message from server
     */
    get: function () {
        $.ajax({
            dataType: "json",
            url: $(".message-info-slider").data("remote"),
            success: function (data) {
                if (data.length > 0) {
                    var items = [];
                    $.each(data, function (i, message) {
                        if (message.image) {
                            items.push('<li class="message-image">'
                                    + '<img src="/upload/images/' + message.image + '"/>'
                                    + "</li>"
                                    );
                        } else {
                            items.push('<li>'
                                    + '<div class="title">' + message.title + '</div>'
                                    + '<div class="content">' + message.content + '</div>'
                                    + "</li>"
                                    );
                        }
                    });
                    $(".message-info-slider").html("<ul>"+items.join("")+"</ul>");
                    messageInfoSlider.run();
                } else {
                    $(".main").fadeIn(1000);
                }
            },
            /**
             * If error show offline existing message
             */
            error: function () {
                if ($(".message-info-slider li").length > 0) {
                    messageInfoSlider.run();
                } else {
                    $(".main").fadeIn(1000);
                }
            },
        });
    },
    moveRight: function () {
        var screenWidth = $(window).width();
        $('.message-info-slider ul').animate({
            left: -screenWidth
        }, 1000, function () {
            $('.message-info-slider li:first-child').appendTo('.message-info-slider ul');
            $('.message-info-slider ul').css('left', '');
        });
    },
    messageInfoIsShowing: false,
    /**
     * Cron handling message info showing
     * The messages will be shown
     *  - 5 before every adhan 
     *  - 5 before jumu`a
     *  - At defined time
     */
    initCronMessageInfo: function () {
        setInterval(function () {
            if (messageInfoSlider.messageInfoIsShowing === false) {
                var date = new Date();
                var diffTimeInMiniute;
                // 5 before every adhan
                $(prayer.getTimes()).each(function (i, time) {
                    diffTimeInMiniute = Math.floor((date - prayer.getCurrentDateForPrayerTime(time)) / prayer.oneMinute);
                    if (diffTimeInMiniute === -5) {
                        messageInfoSlider.get();
                        return;
                    }
                });

                // 5 min before jumu`a time
                if (date.getDay() === 5) {
                    diffTimeInMiniute = Math.floor((date - prayer.getCurrentDateForPrayerTime(prayer.getJumuaTime())) / prayer.oneMinute);
                    if (diffTimeInMiniute === -5) {
                        messageInfoSlider.get();
                        return;
                    }
                }
            }
        }, prayer.oneMinute);
    },
    setFontSize: function () {
        var $body = $('body');
        $('.message-info-slider li').each(function (i, slide) {
            var $slide = $(slide);
            $slide.css('font-size', '200px');
            while ($slide.height() > $body.height() - 20) {
                $slide.css('font-size', (parseInt($slide.css('font-size')) - 1) + "px");
            }
        });
    }
};