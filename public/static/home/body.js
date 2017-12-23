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

    // 获取动态
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
            var str = "<div class='situation-li'>" +
                "    <div class='message-li title'>" +
                "        <img class='avatar' src='/static/image/logo@white.png'>" +
                "        <div class='line'>" +
                "            <span class='user'>" + article['title'] + "</span>" +
                "        </div>" +
                "        <div class='line'>" +
                "            <span class='bio'>" + article['create_time'] + "</span>" +
                "        </div>" +
                "    </div>" +
                "    <div class='desc'>" + subtext(parser.makeHtml(article['body']), 200) +
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
            $(".situation-load").before(str);
        }
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
                    str += "<div class='message-li'> " +
                        "<img class='avatar' src='/static/image/logo@white.png'> " +
                        "<div class='line'> " +
                        "<span class='user'>" + category.links[j].name + "</span> " +
                        "</div> " +
                        "<div class='line'> " +
                        "<span class='bio'>" + category.links[j].intro + "</span> " +
                        "</div> " +
                        "</div> ";
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
        $(".footer-archive").find('i').attr('class', 'fa fa-star');
    }
});