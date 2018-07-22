window.base = {
    g_restUrl: "https://api.nixiaomo.com/v1",

    getData: function (params) {
        showLoading();
        if (!params.type) {
            params.type = 'get';
        }
        var that = this;
        $.ajax({
            type: params.type,
            url: this.g_restUrl + params.url,
            data: params.data,
            beforeSend: function (XMLHttpRequest) {
                if (params.tokenFlag) {
                    XMLHttpRequest.setRequestHeader('token', that.getLocalStorage('token'));
                }
            },
            success: function (res) {
                hideLoading();
                params.sCallback && params.sCallback(res);
            },
            error: function (e) {
                hideLoading();
                if (params.eCallback) {
                    params.eCallback(e);
                } else {
                    that.eCallback(e);
                }
            }
        });
    },

    eCallback: function (e) {
        if (e.status == 401) {
            this.deleteLocalStorage('token');
            window.location.href = '/login';
        } else if (e.status == 404) {
            window.location.href = '/404';
        }
        var obj = $.parseJSON(e.responseText).msg;
        if (typeof obj != 'string') {
            var msg = '';
            $.each(obj, function (i, item) {
                msg += item + '<br>';
            });
            obj = msg;
        }
        showTips(obj);
    },

    setLocalStorage: function (key, val) {
        var exp = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;  // 令牌过期时间
        var obj = {
            val: val,
            exp: exp
        };
        localStorage.setItem(key, JSON.stringify(obj));
    },

    getLocalStorage: function (key) {
        var info = localStorage.getItem(key);
        if (info) {
            info = JSON.parse(info);
            if (info.exp > new Date().getTime()) {
                return info.val;
            } else {
                this.deleteLocalStorage(key);
            }
        }
        return '';
    },

    deleteLocalStorage: function (key) {
        return localStorage.removeItem(key);
    },

    formatSize: function (size) {
        var ext = ['B', 'KB', 'MB', 'GB', 'TB'];
        var i = 0;
        for (; size >= 1024 && i < 4; i++)
            size /= 1024;
        return size.toFixed(2) + ext[i];
    }
};
$(function () {
    var href = window.location.href;
    var token = window.base.getLocalStorage('token');
    if (href.indexOf('/cms') != -1 && !token) {
        window.location.href = '/login';
    } else if (href.indexOf('/login') != -1 && token) {
        window.location.href = '/cms';
    }
    $(window).resize();
});