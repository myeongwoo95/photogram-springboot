$(document).ready(function(){
    $(document).on("mouseover", ".only_images__image-item", function(){
        $(this).find(".only_images__image-item__info").css("display", "flex")
    })

    $(document).on("mouseout", ".only_images__image-item", function(){
        $(this).find(".only_images__image-item__info").css("display", "none")
    })

    $(document).on("click", ".only_images__image-item", function(){
        $(".modal-comment-wrapper").css("display", "flex");
    })
});