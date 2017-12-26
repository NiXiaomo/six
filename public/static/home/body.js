$(function () {
    const MESSAGE = 'message';
    const CONTACT = 'contact';
    const SITUATION = 'situation';

    // 选项卡切换
    $("footer .col-xs-4").click(function () {
        if ($(this).attr('class') == $("footer .col-xs-4[artive='active']").attr('class')) {
            return;
        }
        // 显示
        _clearTab();
        var tmp = $(this).css('color', '#6E564A').attr('active', 'active').attr('class').split('-');
        var footer = tmp[tmp.length - 1];
        $('.tab-' + footer).show();
        // 修改
        if (footer == 'message') {
            $('header .title').text('消息');
            $(this).find('i').attr('class', 'fa fa-commenting');
        } else if (footer == 'contact') {
            $('header .title').text('联系人');
            $(this).find('i').attr('class', 'fa fa-users');
            getContact();
        } else {
            $('header .title').text('动态');
            $(this).find('i').attr('class', 'fa fa-star-half-o');
            getSituation();
        }
    });

    // 刷新
    $("header .refresh").click(function () {
        // click
        var footer = $("footer .col-xs-4[active='active']");
        var tmp = footer.attr('class').split('-');
        tmp = tmp[tmp.length - 1];
        window.base.deleteLocalStorage(tmp);
        footer.click();
    }).mouseover(function () {
        $(this).addClass('fa-spin');
    }).mouseout(function () {
        $(this).removeClass('fa-spin');
    });

    // 查看更多
    var pageIndex = 1, pageSize = 5, isLoading = false;
    $(".situation-load").click(function () {
        if (!isLoading) {
            $(this).hide();
            $(".situation-loading").show();

            pageIndex++;
            getSituation(true);
        }
    });

    // 查看详情
    $('.body').on('click', '.situation-li .user', function () {
        var id = $(this).closest('.situation-li').attr('id').split('-')[1];
        var params = {
            url: '/article/' + id,
            sCallback: function (res) {
                if (res) {
                    var str = '<div class="tab tab-situation">' + _getArticleStr(res) + '</div>';
                    $('.article').html(str);
                    $('.article .user').after('<time class="close" title="关闭">&times;</time>');
                    $(window).resize();
                }
            }
        };
        window.base.getData(params);
    });
    // 关闭
    $('.article').on('click', '.close', function () {
        $('.article').hide().html('');
        $(window).resize();
    });

    // 获取动态
    var isFirstLoaded = true;

    function getSituation(isMore) {
        // 从缓存中读取数据
        var situation = window.base.getLocalStorage(SITUATION);
        if (situation) {
            // 不是查看更多，即点击选项卡
            if (!isMore) {
                // 有列表则直接显示
                if ($(".tab-ul .situation-li").length > 0) {
                    return;
                }
                /*// （弃用）没列表则生成列表
                // 不能直接从缓存中取数据，因为无法判断是否显示“查看更多”，以及后续的根据pageIndex
                _generateSituation(situation);*/
                // 没列表则刷新
                $("header .refresh").click();
                return;
            }
        } else {
            $(".tab-ul .situation-li").remove();
            pageIndex = 1;
        }

        var params = {
            url: '/article',
            data: {
                'page': pageIndex,
                'size': pageSize
            },
            sCallback: function (res) {
                if (res && !$.isArray(res.data)) {
                    var data = res.data.data;
                    _generateSituation(data);
                    // 查看更多，追加数据
                    if (situation && isMore) {
                        data = situation.concat(data);
                    }
                    window.base.setLocalStorage(SITUATION, data);
                    // 第一次加载
                    if (isFirstLoaded) {
                        $('.body .tab .situation-li:eq(0) .user').click();
                        isFirstLoaded = !isFirstLoaded;
                    }
                }
            }
        };
        window.base.getData(params);
    }

    // 联系人列表
    $(".tab-contact").on("click", ".category-li", function () {
        $(this).parent().toggleClass("contact-active");
        $(this).find('.icon-arrow').toggleClass('fa-caret-right').toggleClass('fa-caret-down');
    });

    // 获取联系人
    function getContact() {
        var contact = window.base.getLocalStorage(CONTACT);
        if (contact) {
            // 有列表则直接显示
            if ($(".tab-ul .contact-li").length > 0) {
                return;
            }
            _generateContact(contact);
            return;
        }
        var params = {
            url: '/category/all',
            sCallback: function (res) {
                if (res) {
                    window.base.setLocalStorage(CONTACT, res);
                    _generateContact(res);
                }
            }
        };
        window.base.getData(params);
    }

    // 生成动态
    var parser = new HyperDown;

    function _generateSituation(data) {
        if (data.length < pageSize) {
            $(".situation-loading").hide();
            $(".situation-load").hide();
            if (data.length == 0) {
                return;
            }
        } else {
            $(".situation-loading").hide();
            $(".situation-load").show();
        }

        // 生成
        for (var i = 0; i < data.length; i++) {
            var article = data[i];
            var str = _getArticleStr(article, true);
            $(".situation-load").before(str);
        }
        $(".tab-ul .situation-li:eq(0)").css('margin-top', '0px');
    }

    // 获取文章内容
    function _getArticleStr(article, isList) {
        var str = "<div class='situation-li' id='situation-" + article['id'] + "'>" +
            "    <div class='message-li title'>" +
            "        <img class='avatar' src='/static/image/logo@white.png'>" +
            "        <div class='line'>" +
            "            <span class='user'>" + article['title'] + "</span>" +
            "        </div>" +
            "        <div class='line'>" +
            "            <span class='bio' title='最近更新时间'>" + getFormatDate(article['update_time']) + "</span>" +
            "        </div>" +
            "    </div>" +
            "    <div class='desc'>" + (isList ? subtext(parser.makeHtml(article['body']), 200) : parser.makeHtml(article['body'])) +
            "    </div>" +
            "    <div class='tool-bar'>" +
            "        <span class='look'>浏览123次</span>" +
            "        <div class='pull-right'>" +
            "            <i class='glyphicon glyphicon-thumbs-up'></i>" +
            "            <i class='glyphicon glyphicon-comment'></i>" +
            "            <i class='glyphicon glyphicon-share'></i>" +
            "        </div>" +
            "    </div>" +
            "    <div class='tags'>" +
            "        <i class='fa fa-tags'></i>" +
            "        已添加「";
        if (article.tags.length > 0) {
            for (var j = 0; j < article.tags.length; j++) {
                str += "<a href='javascript:;' class='tag' id='tag-" + article.tags[j]['id'] + "'>"
                    + article.tags[j]['name'] + "</a>";
            }
        }
        str += "        」共" + article.tags.length + "个标签" +
            "    </div>" +
            "</div>";
        return str;
    }

    // 生成联系人
    function _generateContact(res) {
        var str = '';
        for (var i = 0; i < res.length; i++) {
            var category = res[i];
            str += "<div class='contact-li'> " +
                "<div class='category-li'> " +
                "<i class='fa fa-caret-right icon-arrow'></i> " +
                "<span class='name'>" + category.name + "</span> " +
                "<span class='pull-right'>" + category.links.length + "</span> " +
                "</div> ";
            if (category.links.length > 0) {
                str += "<div class='user-ul'> ";
                for (var j = 0; j < category.links.length; j++) {
                    str += "<a class='message-li' href='" + getUrl(category.links[j].url) + "' target='_blank'>" +
                        "<img class='avatar' src='" + getLogoUrl(category.links[j].logo_url) + "'> " +
                        "<div class='line'> " +
                        "<span class='user'>" + category.links[j].name + "</span> " +
                        "</div> " +
                        "<div class='line'> " +
                        "<span class='bio'>" + category.links[j].intro + "</span> " +
                        "</div> " +
                        "</a> ";
                }
                str += "</div> ";
            }
            str += "</div>";
        }
        $('.tab-contact .contact-ul').html(str);
    }

    // 清空tab
    function _clearTab() {
        $(".tab").hide();
        $("footer .col-xs-4").css('color', '#ABADBC').removeAttr('active');
        $(".footer-message").find('i').attr('class', 'fa fa-comment');
        $(".footer-contact").find('i').attr('class', 'fa fa-user');
        $(".footer-situation").find('i').attr('class', 'fa fa-star');
    }

    // 获取logo url
    function getLogoUrl(url) {
        if (!url) {
            url = '/static/image/logo@default.png';
        }
        return url;
    }

    // 获取url
    function getUrl(url) {
        if (url.indexOf('http://') == -1) {
            url = 'http://' + url;
        }
        return url;
    }

    // 获取格式化的时间
    function getFormatDate(dateStr) {
        // 今天
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        // 一天
        var oneDay = 1000 * 60 * 60 * 24;
        // 指定时间
        var date = new Date(dateStr);
        var year = date.getFullYear();
        var month = _getFullDateStr(date.getMonth() + 1);
        var day = _getFullDateStr(date.getDate());
        var hours = _getFullDateStr(date.getHours());
        var minutes = _getFullDateStr(date.getMinutes());
        // 格式化时间
        if (today.getTime() <= date.getTime() && date.getTime() < today.getTime() + oneDay) {
            return '今天' + hours + ':' + minutes;
        } else if (today.getTime() - oneDay <= date.getTime() && date.getTime() < today.getTime()) {
            return '昨天' + hours + ':' + minutes;
        } else if (today.getFullYear() == year) {
            return month + '月' + day + '日' + hours + ':' + minutes;
        } else {
            return year + '年' + month + '月' + day + '日' + hours + ':' + minutes;
        }
    }

    function _getFullDateStr(str) {
        return str < 10 ? '0' + str : str;
    }
});