$(document).ready(function(){
    $(".btn-edit-profile").on("click", function(){
        $(this).addClass("active");
        $(".btn-edit-pw").removeClass("active");
        $(".btn-edit-push").removeClass("active");


        $(".edit-profile").show();
        $(".edit-pw").hide();
        $(".edit-push").hide();
    })

    $(".btn-edit-pw").on("click", function(){
        $(this).addClass("active");
        $(".btn-edit-profile").removeClass("active");
        $(".btn-edit-push").removeClass("active");

        $(".edit-profile").hide();
        $(".edit-pw").show();
        $(".edit-push").hide();
        
    })

    $(".btn-edit-push").on("click", function(){
        $(this).addClass("active");
        $(".btn-edit-profile").removeClass("active");
        $(".btn-edit-pw").removeClass("active");

        $(".edit-profile").hide();
        $(".edit-pw").hide();
        $(".edit-push").show();
        
    })

    // btn 계정 비활성화 모달 켜기
    $(".btn-disable-account").on("click", function(){
        $(".modal-disable-acount-wrapper").css("display", "flex");
    })

    // btn 계정 비활성화 모달 끄기
    $(".btn-cancel-disable-account").on("click", function(e){
        e.preventDefault();
        $(".modal-disable-acount-wrapper").hide();
    })

    // btn 계정 비활성화 API
    $(".btn-disable-account-run").on("click", function(e){
        alert("계정 비활성화 API 로직");
        $(".modal-disable-acount-wrapper").hide();
    })

    // btn 제출
    $(".btn-submit-edit-infos").on("click", function(e){
        e.preventDefault();

        let id = $("#hidden-user-id").val();

        let data = {
            "name": $('input[name=name]').val(),
            "username": $('input[name=username]').val(),
            "website": $('input[name=website]').val(),
            "bio":$('textarea[name=bio]').val(),
            "email": $('input[name=email]').val(),
            "tel": $('input[name=tel]').val(),
            "gender": $('input[name=gender]').val()
        };

        $.ajax({
           type: "put",
            url: `/api/v1/users/${id}/`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data)
        }).done(res => {
            console.log(res);
            alert("성공적으로 수정되었습니다");
            location.href="/user/update";
        }).fail(error => {
            console.log(error);
            alert(error.responseJSON.message);
        });



        console.log(name,username,website,bio,email,gender);
    })

    // btn 이메일 확인
    $(".btn-confirm-email-check").on("click", function(e){
        alert("이메일 확인 API");
    })

});