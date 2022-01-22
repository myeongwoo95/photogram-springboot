$(document).ready(function(){
     $("#btn-signup").on("click", function(){
        $(".sign-up").show();
        $(".sign-in").hide();
    })

    $("#btn-signin").on("click", function(){
        $(".sign-in").show();
        $(".sign-up").hide();
    })

    $(".btn-api-signup").on("click", function(e){
       e.preventDefault();

       if($("#form-signup [name='username']").val() ==""){
           alert("아이디(사용자 이름)을 입력해주세요");
           $("#form-signup [name='username']").focus();
           return;
       }

       if($("#form-signup [name='email']").val() ==""){
           alert("이메일을 입력해주세요");
           $("#form-signup [name='email']").focus();
           return;
       }

       if($("#form-signup [name='name']").val() ==""){
           alert("성명을 입력해주세요");
           $("#form-signup [name='name']").focus();
           return;
       }

       if($("#form-signup [name='password']").val() ==""){
           alert("비밀번호를 입력해주세요");
           $("#form-signup [name='password']").focus();
           return;
       }

       let username = $("#form-signup [name='username']").val();
       let password = $("#form-signup [name='password']").val();
       let name = $("#form-signup [name='name']").val();
       let email = $("#form-signup [name='email']").val();

       $.ajax({
           type: "post",
            url: "/auth/signup",
               data:{username: username, password: password, email: email, name: name},
        }).done(res => {
            alert("회원가입을 축하드립니다");
               $(".sign-in").show();
               $(".sign-up").hide();

               $("#form-signup [name='username']").val("");
               $("#form-signup [name='password']").val("");
               $("#form-signup [name='name']").val("");
               $("#form-signup [name='email']").val("");

        }).fail(error => {
            console.log(error);
            alert(error.responseJSON.message);
        });

    })
});
