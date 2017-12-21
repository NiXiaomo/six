window.base = {
    g_restUrl: "http://six.me/api/v1",

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
        var exp = new Date().getTime() + 2 * 60 * 60 * 1000;  // 令牌过期时间
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
    }
};