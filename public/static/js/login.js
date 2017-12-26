$(function () {
    $("#login").click(function () {
        var user = $("#user").val();
        var pwd = $("#pwd").val();
        if ($.trim(user) == "" || $.trim(pwd) == "") {
            showTips("请填写完整");
            return;
        }
        var params = {
            url: "/cms",
            type: "post",
            data: {
                ac: user,
                se: pwd
            },
            sCallback: function (res) {
                showTips('登录成功');
                if (res) {
                    window.base.setLocalStorage('token', res.token);
                    window.location.href = '/';
                }
            },
            eCallback: function (e) {
                window.base.eCallback(e);
            }
        };
        window.base.getData(params);
    });

    // 监听回车键事
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $("#login").click();
        }
    });
});