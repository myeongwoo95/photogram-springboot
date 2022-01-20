$(document).ready(function(){

    // 탭 전환 
    $(".btn-photo").on("click", function(){
        $(this).addClass("on")
        $(".btn-save").removeClass("on")
        $(".btn-tag").removeClass("on")

        $(".my-content-tab").show();
        $(".my-save-tab").hide();
        $(".tagged-tab").hide();

    })

    $(".btn-save").on("click", function(){
        $(this).addClass("on")
        $(".btn-photo").removeClass("on")
        $(".btn-tag").removeClass("on")

        $(".my-save-tab").show();
        $(".my-content-tab").hide();
        $(".tagged-tab").hide();
    
    })

    $(".btn-tag").on("click", function(){
        $(this).addClass("on")
        $(".btn-photo").removeClass("on")
        $(".btn-save").removeClass("on")

        $(".tagged-tab").show();
        $(".my-content-tab").hide();
        $(".my-save-tab").hide();
    })

     // btn collection
     $(".btn-collection").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step1-wrapper").css("display", "flex");
    })

    // btn close collection1
    $(".btn-close-collection1").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step1-wrapper").hide();
        $(".collection-naming").val("");
    })

    // btn close collection2
    $(".btn-close-collection2").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step2-wrapper").hide();
    })

    // btn back collection2 -> collection2
    $(".btn-back-from2to1").on("click", function(){
        
        $(".modal-collection-step2-wrapper").hide();
        $(".modal-collection-step1-wrapper").css("display", "flex");
    })

    // btn step -> step2
    $(".btn-modal-collection-step2").on("click", function(){
        if($(this).hasClass("disabled")){
            return;
        }else{
            $(".modal-collection-step1-wrapper").hide();
            $(".modal-collection-step2-wrapper").css("display", "flex");
        }
    })

    // 컬렉션 naming시 value값 있을 때와 없을 때 처리
    $(".collection-naming").on("keyup", function(e){
        if(!$(this).val()){
            $(".btn-modal-collection-step2").addClass("disabled");
            $(".btn-modal-collection-step2").css("color", "gray");
        }else{
           
            $(".btn-modal-collection-step2").removeClass("disabled");
            $(".btn-modal-collection-step2").css("color", "#0095F6");
        }
    });

    // image 클릭시 
    $(".photo-item").on("click", function(){
        $(".modal-comment-wrapper").css("display", "flex");
    })
});