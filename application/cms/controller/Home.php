<?php
/**
 * Home控制器
 *
 * @author xiaomo<i@nixiaomo.com>
 */

namespace app\cms\controller;


use think\Controller;

class Home extends Controller
{
    public function index()
    {
        return $this->fetch('home/index');
    }

    public function login()
    {
        return $this->fetch('public/login');
    }

    public function article()
    {
        return $this->fetch('home/article');
    }

    public function editor($id = 0)
    {
        $this->assign('id', $id);
        return $this->fetch('public/editor_md');
    }

    public function link()
    {
        return $this->fetch('home/link');
    }
}