window.upload = {
    uploadProgressFile: function (params) {
        var that = this;
        // 获取文件对象
        var fileObj = "";
        if (params.inputFile) {
            fileObj = params.inputFile.files[0];
            if (typeof(fileObj) == "undefined") fileObj = "";
        }
        // FormData 对象
        var form = new FormData();
        if (params.data) {
            $.each(params.data, function (name, value) {
                form.append(name, value);   // 增加表单数据
            });
        }
        form.append("file[]", fileObj);   // 文件对象

        // ajax异步上传
        $.ajax({
            url: params.url,
            type: "POST",
            data: form,
            xhr: function () {  // 获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // 检查upload属性是否存在
                    // 绑定progress事件的回调函数
                    var progressHandler;
                    if (params.pCallback) {
                        progressHandler = params.pCallback;
                    } else {
                        progressHandler = that.progressHandler;
                    }
                    myXhr.upload.addEventListener('progress', progressHandler, false);
                }
                return myXhr; // xhr对象返回给jQuery使用
            },
            success: function (res) {
                params.sCallback && params.sCallback(res);
            },
            error: function (e) {
                params.eCallback && params.eCallback(e);
            },
            contentType: false, // 必须false才会自动加上正确的Content-Type
            processData: false  // 必须false才会避开jQuery对 formdata 的默认处理
        });
    },

    /**
     * 上传进度回调函数
     */
    progressHandler: function (e) {
        if (e.lengthComputable) {
            // 更新数据到进度条
            var percent = e.loaded / e.total * 100;
            showTips("文件正在上传：" + percent.toFixed(0) + "%");
        }
    }
};