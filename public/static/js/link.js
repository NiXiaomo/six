$(function () {
    var treeData, tree;
    generateTree(false);

    // 添加
    $("#add").click(function () {
        clear();
        $("#delete").hide();
        var node = tree.treeview('getSelected')[0];
        if (node) {
            _showAll();
            if (typeof(node['parentId']) == "undefined") {
                var node_id = node['href'].split('-')[1];
                $("#categoryID").val(node_id);
                $("#categorySelect").val(node_id);
            } else {
                var category_id = tree.find('ul li[data-nodeid="' + node['parentId'] + '"] a')
                    .attr('href').split('-')[1];
                $("#categoryID").val(category_id);
                $("#categorySelect").val(category_id);
            }
        } else {
            _showCategoryOnly();
        }
    });

    // 删除
    $("#tipSure").click(function () {
        var link_id = $("#linkID").val();
        var category_id = $("#categoryID").val();
        var url;
        if (link_id) {
            url = '/link/' + link_id;
        } else if (category_id) {
            url = '/category/' + category_id;
        } else {
            return;
        }

        var params = {
            url: url,
            type: 'DELETE',
            sCallback: function (res) {
                $("#tipCancel").click();
                if (res) {
                    showTips('删除成功');
                    generateTree(true);
                }
            }
        };
        window.base.getData(params);
    });

    // 保存
    $("#save").click(function () {
        var params = _generateSaveParams();
        params.type = 'POST';
        params.sCallback = function (res) {
            // console.log(res);
            generateTree(true);
        };
        window.base.getData(params);
    });

    // 生成参数
    function _generateSaveParams() {
        var category_select = $("#categorySelect").val();
        var params = {};
        if (category_select) {
            // 友链
            params = {
                url: '/link',
                data: {
                    category_id: category_select,
                    id: $("#linkID").val(),
                    name: $("#linkName").val(),
                    url: $("#linkUrl").val(),
                    logo_url: $("#linkLogoUrl").val(),
                    intro: $("#linkIntro").val()
                }
            };
        } else {
            // 分类
            params = {
                url: '/category',
                data: {
                    id: $("#categoryID").val(),
                    name: $("#categoryName").val()
                }
            };
        }
        return params;
    }

    // 生成树
    function generateTree(refresh) {
        getLinks(refresh, function (res) {
            treeData = res;
            _generateCategorySelect();
            var data = _formatTreeData(res);
            tree = $('#tree').treeview({
                data: data,
                levels: 2,
                enableLinks: true,
                onNodeSelected: function (event, node) {
                    clear();
                    var node_id = node['href'].split('-')[1];
                    if (typeof(node['parentId']) == "undefined") {
                        _showCategoryOnly();
                        $("#categoryID").val(node_id);
                    } else {
                        _showAll();
                        var category_id = tree.find('ul li[data-nodeid="' + node['parentId'] + '"] a')
                            .attr('href').split('-')[1];
                        $("#categoryID").val(category_id);
                        $("#categorySelect").val(category_id);
                        $("#linkID").val(node_id);
                    }

                    showNodeInfo();
                },
                onNodeUnselected: function (event, node) {
                    clear();
                    $(".editor").hide();
                }
            });
        });
    }

    // 展示节点信息
    function showNodeInfo() {
        if (treeData) {
            var category_id = $("#categoryID").val();
            var link_id = $("#linkID").val();
            for (var i = 0; i < treeData.length; i++) {
                if (treeData[i]['id'] == category_id) {
                    $("#categoryName").val(treeData[i]['name']);
                    if (link_id) {
                        var links = treeData[i]['links'];
                        for (var j = 0; j < links.length; j++) {
                            if (links[j]['id'] == link_id) {
                                $("#linkName").val(links[j]['name']);
                                $("#linkUrl").val(links[j]['url']);
                                $("#linkLogoUrl").val(links[j]['logo_url']);
                                $("#linkIntro").val(links[j]['intro']);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    // 获取links
    function getLinks(refresh, callback) {
        if (!window.base.getLocalStorage('links') || refresh) {
            var params = {
                url: '/category/all',
                sCallback: function (res) {
                    window.base.setLocalStorage('links', res);
                    callback && callback(res);
                }
            };
            window.base.getData(params);
        } else {
            var res = window.base.getLocalStorage('links');
            callback && callback(res);
        }
    }

    // 生成分类下拉框
    function _generateCategorySelect() {
        $(".editor").hide();
        if (treeData) {
            var options = '';
            for (var i = 0; i < treeData.length; i++) {
                options += "<option value='" + treeData[i]['id'] + "'>" + treeData[i]['name'] + "</option>";
            }
            $("#categorySelect").html(options);
        }
    }

    // 整理树数据
    function _formatTreeData(res) {
        var tree = [];
        for (var i = 0; i < res.length; i++) {
            var obj = {};
            obj.href = '#node-' + res[i]['id'];
            obj.text = res[i]['name'];
            obj.nodes = [];
            var links = res[i]['links'];
            for (var j = 0; j < links.length; j++) {
                var subObj = {};
                subObj.href = '#subnode-' + links[j]['id'];
                subObj.text = links[j]['name'];
                obj.nodes.push(subObj);
            }
            tree.push(obj);
        }
        return tree;
    }

    function clear() {
        $(".editor").show();
        $("#delete").show();
        $("#categoryID").val('');
        $("#categoryName").val('');
        $("#categorySelect").val('');
        $("#linkID").val('');
        $("#linkName").val('');
        $("#linkUrl").val('');
        $("#linkLogoUrl").val('');
        $("#linkIntro").val('');
    }

    function _showCategoryOnly() {
        $("#categoryName").show();
        $("#categorySelect").hide();
        $("#linkID").parent().hide();
        $("#linkName").parent().hide();
        $("#linkUrl").parent().hide();
        $("#linkLogoUrl").parent().hide();
        $("#linkIntro").parent().hide();
    }

    function _showAll() {
        $("#categoryName").hide();
        $("#categorySelect").show();
        $("#categoryID").parent().show();
        $("#linkID").parent().show();
        $("#linkName").parent().show();
        $("#linkUrl").parent().show();
        $("#linkLogoUrl").parent().show();
        $("#linkIntro").parent().show();
    }
});