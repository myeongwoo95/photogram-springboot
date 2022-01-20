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
});