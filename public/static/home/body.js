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
        }
    });

    // 刷新
    $("header .refresh").click(function () {
        // click
        var footer = $("footer .col-xs-4[active='active']");
        var tmp = footer.attr('class').split('-');
        window.base.deleteLocalStorage(tmp[tmp.length - 1]);
        footer.click();
    }).mouseover(function () {
        $(this).addClass('fa-spin');
    }).mouseout(function () {
        $(this).removeClass('fa-spin');
    });

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