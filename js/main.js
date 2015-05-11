/**
 * Created by Shinsilka on 30.04.15.
 */


$(document).ready(function() {

    function show() {
        if (location.hash === "" || location.hash === "#list") {
            showList();
        } else if(location.hash === "#map") {
            showMap();
        } else if(location.hash === "#form") {
            showForm();
        }
    }
    show();


    $(window).on('hashchange', function() {
        show();
    });


    var formTpl = _.template($('#form_tpl').html());
    var listTpl = _.template($('#list_tpl').html());
    var detailsTpl = _.template($('#details_tpl').html());
    var itemTpl = _.template($('#item_tpl').html());
    var mapTpl = _.template($('#map_tpl').html());
    var navTpl = _.template($('#nav_tpl').html());

    $('body').prepend(navTpl());

    function showForm() {
        $('.container').html(formTpl());


        // Set date

        $( "#date" ).datepicker({
            showOn: "button",
            buttonImage: "images/icon-calendar.png",
            buttonImageOnly: true,
            buttonText: "Select date"
        });

        // Validation

        $('.event-form').parsley();


        setStyles();
    }
    showForm();

    function showList() {


        $('form').on('submit', function(event) {
            event.preventDefault();

            var title = $(this).find('[name="title"]').val();
            var date = $(this).find('[name="date"]').val();
            var description = $(this).find('[name="description"]').val();
            var image = $(this).find('[name="image"]').val();
            var video = $(this).find('[name="video"]').val();
            var coordinates = $(this).find('[name="map"]').val();
            var rating = $(this).find(':checkbox:checked').attr('class');

            var event = {title:title,date:date,description:description,image:image,video:video,coordinates:coordinates,rating:rating};



            localStorage.setItem("event", JSON.stringify(event));

            $('.container').html(listTpl());

            JSON.parse(localStorage.getItem("event"));

            $('.list').prepend(itemTpl({title: event.title, date: event.date, rating: event.rating, src: event.image}));


            // Autocomlete

            var availableTags = [
                'Fiesta',
                'Monster Party',
                "Peter's Birthday",
                'Wedding',
                'Stag-party',
                'Christmas holidays',
                'First Date',
                'Pussy-cat buying',
                "Air balloon's trip"
            ];
            availableTags.push(event.title);

            $( "#search" ).autocomplete({
                source: availableTags
            });


           /* // Show event by search

            $( ".toolbar").on('change', '#search', function() {
                var value =  $( "#search").val();

                if(value !== '') {
                    $('.item-box').each(function(i){
                        var title = this.find('h2').text();

                        if(value != title) {
                            this.hide();
                        }
                    });
                }

            });*/

            showDetails(event.description, event.video, event.coordinates);

            deleteEvent();
        });

    }
    showList();


    // Delete event

    function deleteEvent() {
        $('.item-box').on('click', '.icon-trash-empty', function () {
            $(this).closest('.item-box').remove();
        });
    }




    // Show details

    function showDetails(param1, param2, param3) {
        $('.item-box').on('click', '.icon-eye', function() {
            var eventTitle = $(this).closest('.item-box').find('h2').text();
            var eventImage = $(this).closest('.item-box').find('img').attr('src');
            var eventDate = $(this).closest('.item-box').find('.date').text();
            var eventRating = $(this).closest('.item-box').find('.rating').attr('class');

            $('.container').html(detailsTpl({title: eventTitle, rating: eventRating, src: eventImage, date: eventDate, description: param1, video: param2}));



            showMap(param3);

        });
    }


    // Show map

    function showMap(param) {
        $('.map-container').html(mapTpl());

        // Google map

        var mapOptions = {
            center: new google.maps.LatLng(param),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(param),
            map: map,
            draggable:true
        });
    }




    //Text editor

    function setStyles() {
        var color = $('.color-box');
        var text = $('textarea');
        var styles = [];

        color.on('click', function() {
            color.removeClass('active');
            $(this).toggleClass('active');

            var newColor = $('.active').css('background-color');
            text.css('color', newColor);
            styles.push('color:' + newColor + ';');
        });

        $('.f-size').find('select').on('change', function() {
            var fontSize = $(this).find(':selected').val();
            text.css('font-size', fontSize);
            styles.push('font-size:' + fontSize + ';');
        });

        $('.f-family').find('select').on('change', function() {
            var fontFamily = $(this).find(':selected').val();
            text.css('font-family', fontFamily);
            styles.push('font-family:' + fontFamily + ';');
        });

        return styles;

    }


    // Add more images to form

    /*function addImage() {
        var previewTpl = _.template($('#preview_tpl').html());
        var moreImgTpl = _.template($('#moreImg_tpl').html());

        $('.images').on('change', 'input', function() {
            var src = $('.images').find('#image').val();

            if($(this).val() !== '') {
                $(this).next().remove();
                $(this).after(previewTpl({src: src}));
                $(this).closest('.form-group').nextAll('.btn').removeAttr('disabled');
            }

        });

        $('.images').find('.btn').on('click', function() {

            $(this).before(moreImgTpl());
        })
    }
    addImage();*/

});
