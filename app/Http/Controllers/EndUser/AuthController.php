<?php

namespace App\Http\Controllers\EndUser;

use App\Customer as MainModel;
use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class AuthController extends Controller
{
    protected $pathView = "enduser.pages.Auth.";
    protected $model;
    protected $remove = ["_token", "password_confirmation"];


    public function __construct(){
        $this -> model = new MainModel();
    }

    public function login(){
        //Set intended url để lưu vào session previous url
        Redirect::setIntendedUrl(url()->previous());
        return view($this -> pathView . "login");
    }


    public function checkLogin(Request $request){
        $email = $request -> email;
        $password = $request -> password;

        if( Auth::guard("customer")->attempt(["email" => $email, "password" => $password]) ){
            //dùng RouteServiceProvider để lấy session từ intended đã thêm
            return redirect() -> intended(RouteServiceProvider::HOME);
        }
        else{
            return redirect() -> route("auth.login");;
        }
    }

    public function register(){
        return view($this -> pathView . "register");
    }

    public function checkRegister(Request $request){
        $this -> validateForm($request);

        $data = $this -> getData($request -> all());

        foreach ($data as $key => $value){
            if($key == "password"){
                $value = Hash::make($value);
            }

            $this -> model -> $key = $value;
        }

        $this -> model -> save();
        $this -> checkLogin($request);
        return redirect() -> intended(RouteServiceProvider::HOME);
    }

    public function logout(){
        Auth::guard("customer")->logout();
        return redirect() -> route("auth.login");
    }

    public function getData($request){
        return array_diff_key($request, array_flip($this -> remove));
    }

    public function validateForm(Request $request){
        $validate = $request -> validate([
            "name" => "required",
            // confirmed work khi name của input nhập lại mật khẩu có name là password_confirmation
            "password" => "required|min:8|confirmed",
            "phone" => "required",
            "email" => "required|unique:customers,email",

        ],[
            "required" => ":attribute không được để trống",
            "min" => ":attribute ít nhất 8 kí tự",
            "email" => ":attribute phải là kiểu email '@' ",
            "unique" => ":attribute đã tồn tại",
            "confirmed" => ":attribute không khớp",

        ],[
            "name" => "Tên",
            "password" => "Mật khẩu",
            "phone" => "Số điện thoại",
            "email" => "Email",

        ]);

        return $validate;
    }
}