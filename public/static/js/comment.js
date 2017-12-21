// 回复
$(".comment-block").on('click', '.reply', function () {
    var main = $(this).closest('.comment-main');
    if (main.parent().children('.comment-form').length == 0) {
        $(main).after("<div class='comment-form'> <div class='form-group'> " +
            "<textarea class='form-control'></textarea> </div> " +
            "<button class='btn btn-success btn-submit'>回复评论</button>" +
            " <button class='btn btn-link btn-cancel'>取消</button> </div>");
    } else {
        main.parent().children('.comment-form').remove();
    }
});
// 取消
$(".comment-block").on('click', '.btn-cancel', function () {
    $(this).closest('.comment-form').remove();
});
// 确定
$(document).on('click', '.btn-submit', function () {
    var content = $(this).parent().find('textarea').val();
    $(this).parent().find('textarea').val('');
    var pid = 0, p_user_id = 0;
    if (!$(this).hasClass('btn-main')) {
        p_user_id = $(this).closest('.comment').children('.comment-main').find('.author:eq(0)').attr('data-id');
        var comment = $(this).closest('.comments').parent();
        if (comment.hasClass('comment')) {
            pid = comment.attr('id').split('-')[1];
        } else {
            pid = $(this).closest('.comment').attr('id').split('-')[1];
        }
    }

    var params = {
        url: set_url,
        type: 'post',
        data: {
            id: obj_id,
            pid: pid,
            p_user_id: p_user_id,
            content: content
        },
        sCallback: function (res) {
            getComments();
        }
    };
    window.base.getData(params);
});

function getComments() {
    // 获取评论
    $.get(get_url, function (data) {
        if (data.code && data.code != 200) {
            showTips(data.msg);
        } else {
            var pageHtml = "<div class='col-md-10 col-md-offset-1'><div class='comments'>";
            reply = reply ? "<a class='reply'>回复</a>" : "";
            $.each(data, function (i, item) {
                pageHtml += "<div class='comment' id='comment-" + item['id'] + "'> " +
                    "<div class='comment-main'> <div class='comment-author'>" +
                    "<a class='author' data-id='" + item['user']['id'] + "'>" + item['user']['name'] + "</a> </div> " +
                    "<div class='comment-content'>" + convert_eol(item['content']) + "</div> " +
                    "<div class='comment-time'> <span>时间：</span>" +
                    "<time>" + item['create_time'] + "</time> " + reply + " </div> </div>";
                if (item.children) {
                    pageHtml += "<div class='comments'>";
                    $.each(item.children, function (i, child) {
                        pageHtml += "<div class='comment' id='comment-" + child['id'] + "'> " +
                            "<div class='comment-main'> <div class='comment-author'> " +
                            "<a class='author' data-id='" + child['user']['id'] + "'>" + child['user']['name'] + "</a><span>回复</span>" +
                            "<a class='author' data-id='" + child['p_user']['id'] + "'>" + child['p_user']['name'] + "</a></div> " +
                            "<div class='comment-content'>" + convert_eol(child['content']) + "</div> " +
                            "<div class='comment-time'> <span>时间：</span> " +
                            "<time>" + child['create_time'] + "</time> " + reply + " </div> </div>";
                        pageHtml += "</div>";
                    });
                    pageHtml += "</div>";
                }
                pageHtml += "</div>";
            });
            pageHtml += "</div></div>";
            $(".comment-block").html(pageHtml);
        }
    });
}

function convert_eol(str) {
    str = str.replace(/\r\n/g, "</p><p>");
    str = str.replace(/\n/g, "</p><p>");
    str = '<p>' + str + '</p>';
    return str;
}

function initCommentBlock() {
    $(".comment-block").before("<div class='row'> <div class='col-md-10 col-md-offset-1 comment-form'> " +
        "<div class='form-group'> <textarea placeholder='发表评论...' class='form-control'></textarea> </div> " +
        "<button class='btn btn-success btn-submit btn-main'>发布评论</button> </div> </div>");
}

function initCommentPanel() {
    $(".comment-block").before("<div class='row'> <div class='col-md-10 col-md-offset-1 comment-form'> " +
        "<a href='#' class='btn btn-success btn-block' data-toggle='modal' data-target='#loginModal'>登录并参与讨论</a>" +
        " </div> </div>");
}

function initComment(objId, getUrl, setUrl, flag) {
    obj_id = objId;
    get_url = getUrl;
    set_url = setUrl;
    reply = flag;

    reply ? initCommentBlock() : initCommentPanel();
}
var obj_id, get_url, set_url, reply;