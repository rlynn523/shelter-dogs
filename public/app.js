$(function() {
    $.fn.editable.defaults.mode = 'inline';
    function displayDogProfiles(data) {
        for (i = 0; i < data.length; i++) {
            var dogs = data[i];
            var input = $('#searchBar').val();
            if (input == dogs.breed) {
                $('#results').html('<p>' + 'name: ' + dogs.name + '<br>' + 'breed: ' +
                    dogs.breed + '<br>' + 'age: ' + dogs.age + '<br>' + 'sex: ' + dogs.sex +
                    '<br>' + 'shelter: ' + dogs.shelter + '</p>');
            }
        }
        $('#searchBar').keydown(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                displayDogProfiles(data);
                $('#searchBar').val('');
            }
        });
        $('#search').submit(function(e) {
            e.preventDefault();
            displayDogProfiles(data);
            $('#searchBar').val('');
        });
    }

    function displaySavedBreeds(data) {
        for (i = 0; i < data.length; i++) {
            var breed = data[i].name;
            $('#savedBreeds').append('<p>' + '<a href="#" class="savedBreeds" data-type="text" data-pk="1" data-url="/breeds" data-title="Enter username">'+ breed + '</a>'+'</p>');
        }
        $('.savedBreeds').editable({
          ajaxOptions: {
            dataType: 'json',
            contentType: 'application/json',
          },
          params: function(params) { return JSON.stringify(params); },
        });
    }
    $('#breeds-form').submit(function(e){
        e.preventDefault();
        var input=$('#save-breeds').val();
        $.ajax({
            url: 'http://localhost:8080/breeds',
            type: 'post',
            data: JSON.stringify({name: input}),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
            },
        });
        $('#savedBreeds').append('<p>' + input + '</p>');
        $('save-breeds').val('');
    });

    function displaySavedShelters(data) {
        for (i = 0; i < data.length; i++) {
            var shelter = data[i].name;
            $('#savedShelters').append('<p>' + shelter + '</p>');
        }
    }

    $.ajax({
        url: 'http://localhost:8080/breeds',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displaySavedBreeds(data);
        },
    });
    $.ajax({
        url: 'http://localhost:8080/shelters',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displaySavedShelters(data);
        },
    });
    $.ajax({
        url: 'http://localhost:8080/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displayDogProfiles(data);
        },
    });
});
