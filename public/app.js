$(function() {
    $.fn.editable.defaults.mode = 'inline';

    function displayDogProfiles(data) {
        var dogs;
        for (i = 0; i < data.length; i++) {
            dogs = data[i];
            var input = $('#searchBar').val();
            $('#savedProfiles').append('<p>' + 'name: ' + dogs.name + '<br>' + 'breed: ' +
                dogs.breed + '<br>' + 'age: ' + dogs.age + '<br>' + 'sex: ' + dogs.sex +
                '<br>' + 'shelter: ' + dogs.shelter + '</p>');
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
            var id = data[i]._id;
            console.log(id);
            $('#savedBreeds').append('<p>' + '<a href="#" class="savedBreeds" data-type="text" data-pk=' + id + ' data-url="/breeds">' + breed + '</a>' + '</p>');
        }
        $('.savedBreeds').editable({
            ajaxOptions: {
                dataType: 'json',
                contentType: 'application/json',
            },
            params: function(params) {
                return JSON.stringify(params);
            },
        });
    }
    $('#breeds-form').submit(function(e) {
        e.preventDefault();
        var input = $('#save-breeds').val();
        $.ajax({
            url: 'https://mysterious-badlands-72714.herokuapp.com/breeds',
            type: 'post',
            data: JSON.stringify({
                name: input
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
            },
        });
        $('#savedBreeds').append('<p>' + input + '</p>');
        $('#save-breeds').val('');
    });

    function displaySavedShelters(data) {
        for (i = 0; i < data.length; i++) {
            var id = data[i]._id;
            var shelter = data[i].name;
            $('#savedShelters').append('<p>' + '<a href="#" class="savedShelters" data-type="text" data-pk=' + id + ' data-url="/breeds">' + shelter + '</a>' + '</p>');
        }
        $('.savedShelters').editable({
            ajaxOptions: {
                dataType: 'json',
                contentType: 'application/json',
            },
            params: function(params) {
                return JSON.stringify(params);
            },
        });
    }
    $('#shelters-form').submit(function(e) {
        e.preventDefault();
        var input = $('#save-shelters').val();
        $.ajax({
            url: 'https://mysterious-badlands-72714.herokuapp.com/shelters',
            type: 'post',
            data: JSON.stringify({
                name: input
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
            },
        });
    });
    $.ajax({
        url: 'https://mysterious-badlands-72714.herokuapp.com/breeds',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displaySavedBreeds(data);
        },
    });
    $.ajax({
        url: 'https://mysterious-badlands-72714.herokuapp.com/shelters',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displaySavedShelters(data);
        },
    });
    $.ajax({
        url: 'https://mysterious-badlands-72714.herokuapp.com/profiles',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            displayDogProfiles(data);

        },
    });
});
