$(document).ready(function(){

     let principalId = $("#principalId").val();

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
            url: `/api/v1/users/${principalId}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data)
        }).done(res => {
            console.log(res);
            alert("성공적으로 수정되었습니다");
            location.href=`/user/${principalId}/update`;
        }).fail(error => {
            console.log(error);
            alert(error.responseJSON.message);
        });
    })

    // btn 이메일 확인
    $(".btn-confirm-email-check").on("click", function(e){
        alert("이메일 확인 API");
    })

    // btn 비밀번호 변경
    $(".btn-updatePassword").on("click", function(e){
        e.preventDefault();

        if($("input[name='currentPassword']").val() == ""){
           alert("이전 비밀번호를 입력해주세요");
           $("input[name='currentPassword']").focus();
           return;
        }

        if($("input[name='newPassword1']").val() == ""){
           alert("새 비밀번호를 입력해주세요");
           $("input-signup [name='newPassword1']").focus();
           return;
        }

        if($("input[name='newPassword2']").val() == ""){
           alert("새 비밀번호 확인을 입력해주세요");
           $("input[name='newPassword2']").focus();
           return;
        }

       if($("input[name='newPassword1']").val() != $("input[name='newPassword2']").val()){
          alert("새 비밀번호가 일치하지 않습니다. 다시 한번 확인해주세요");
          $("input[name='newPassword1']").focus();
          return;
       }

        let data = {
            "currentPassword": $("input[name='currentPassword']").val(),
            "newPassword1": $("input[name='newPassword1']").val(),
            "newPassword2": $("input[name='newPassword2']").val(),
        };

        $.ajax({
            type: "put",
            url: `/api/v1/users/${principalId}/attributes/password`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data)
        }).done(res => {
            console.log(res);
            alert("성공적으로 비밀번호가 변경되었습니다.");

            $("input[name='currentPassword']").val("");
            $("input[name='newPassword1']").val(""),
            $("input[name='newPassword2']").val("")

        }).fail(error => {
            console.log(error);
            alert(error.responseJSON.message);
        });

    })

    // 프로파일 사진 변경 버튼
    $(".btn-profileImageChange").on("click", function(e){
        // input type="file" 클릭 이벤트
        $("#userProfileImageInput").click();
    });

    // 프로파일 사진 변경 버튼(image 눌렀을때)
    $("#userProfileImage").on("click", function(e){
        // input type="file" 클릭 이벤트
        $("#userProfileImageInput").click();
    });


    // 유저가 프로필 이미지를 변경했을때 감지해서 동작
    $("#userProfileImageInput").on("change", function(e){
        let f = e.target.files[0];

        // 이미지 파일이 아닐 경우
        if (!f.type.match("image.*")) {
            alert("이미지를 등록해야 합니다.");
            return;
        }

        //서버에 이미지 전송 준비
        let profileImageForm = $("#userProfileImageForm")[0]; // foam 태그의 id인데 배열로 받아와야 한다.

        // formData 객체를 이용하면 form 태그의 필드와 그 값을 나타내는 일련의 key/value 쌍을 담을 수 있다.
        let formData = new FormData(profileImageForm); // form 태그 안의 데이터가 담긴다. 여기선 이미지가 담김

        console.log(formData);

        $.ajax({
            type: "put",
            url: `/api/v1/users/${principalId}/attributes/image`,
            data: formData,
            contentType: false,
            processData: false,
            enctype: "multipart-form-data"
        }).done(res => {
            //사진 전송 성공시 이미지 변경
            let reader = new FileReader();
            reader.onload = (e) => {
                $("#userProfileImage").attr("src", e.target.result);
                $("#userProfileImage2").attr("src", e.target.result);
                $(".header__profile-picture-img").attr("src", e.target.result);
            }
            reader.readAsDataURL(f); // 이 코드 실행시 reader.onload 실행됨.

        }).fail(error => {
            console.log("사진 변경 오류", error);
            alert("프로필 사진 변경에 실패하였습니다.");
        });

    });
});