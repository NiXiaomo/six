<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\Route;


Route::get('/', 'home/Index/index');
Route::get('login', 'cms/Home/login');
Route::get('cms', 'cms/Home/index');
Route::get('cms/index', 'cms/Home/index');

// 404
Route::get('404', function () {
    return view(APP_PATH . '404.html');
});


// 后台cms
// article
Route::get('cms/article', 'cms/Home/article');
Route::get('cms/article/create', 'cms/Home/editor');
Route::get('cms/article/edit/:id', 'cms/Home/editor');
// link
Route::get('cms/link', 'cms/Home/link');