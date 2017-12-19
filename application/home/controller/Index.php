<?php
/**
 * 首页
 *
 * @author xiaomo<i@nixiaomo.com>
 */

namespace app\home\controller;


use think\Controller;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }
}