var channelId = 'UCimIdsDPn0mE03Cb7C6aR8Q';
var key = 'AIzaSyDu5VgGSNeK2RGvPPRO1TryppltrBxYBDk';
var playlistId = 'PL2fnLUTsNyq7A335zB_RpOzu7hEUcSJbB';
var firstVideos = ["NoGMjV_rMMo", "IeNEyzJob68", "yyKzmDN4zqE"]
var token = null;
var firstVid = firstVideos[Math.floor(Math.random()*firstVideos.length)];;//'STwoa-9jxi0';

const channels = ["UCG6orNVuXIICv9_ifH6msIA", "UCjSzBGfo9gDXP0OerKJ9GZg", "UCakrXQVjsmclKHmnCIqlFMg"]

var comedyUrl = `https://www.googleapis.com/youtube/v3/search`;//?key=${key}}&channelId=UCG6orNVuXIICv9_ifH6msIA&part=snippet,id&order=date&maxResults=20`;


/*
"https://www.googleapis.com/youtube/v3/playlistItems", {
    part: 'snippet',
    key: key,
    maxResults: 10,
    playlistId: playlistId,
    pageToken: token
},
*/


$(document).ready(function () {
    
    // const oldVideos = $.get('./videos.json');  
    // resultsLoop(oldVideos);

    // Event Listeners for articles
    $('main').on('click', 'article', function (e) {
        if ($(e.currentTarget).hasClass('item')) {
            var id = $(this).attr('data-key');
            displayVid(id);
        }
    });

    // Load Videos On Page Load
    loadVids(token);
    displayVid(firstVid);

    function nextVideo(token,channelId) {
        // alert(token)
        loadUrl("https://www.googleapis.com/youtube/v3/search?key="+key+"&order=date&part=snippet&channelId="+channelId+"&pageToken="+token)
        // displayVid(token)
    }

    //Load More Videos On Click
    $('.load-more').on("click", function (e) {
        e.preventDefault();
        // loadVids(token)
        var next = $(this).attr('data-key');
        var channelId = channels[Math.floor(Math.random()*channels.length)];
        // alert(next)
        if (next !== "") {
            // alert(next)
            nextVideo(next, channelId);
        }
    });

    function saveLoop(data) {
        // console.log(data)
        // localStorage.setItem('./videos.json', JSON.stringify(data))
        resultsLoop(data);
    }
    function loadUrl(url) {
        $.get(
            url,
            function (data) {
                // console.log(data)
                var nextPage = data.nextPageToken;
                resultsLeft(nextPage);
                saveLoop(data)
        });
    }

    //Get Request
    function loadVids(token) {
        for (var i = channels.length - 1; i >= 0; i--) {
            channels[i]
            loadUrl(`https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channels[i]}&part=snippet,id&order=date&maxResults=10`);
        }
    }

    //Check if there are any results left
    function resultsLeft(nextPage) {
        if (nextPage === undefined) {
            $('.load-more').attr("data-key", "").html('No More Results').addClass('disabled');
        } else {
            $('.load-more').attr("data-key", nextPage);
        }
    }

    //Loop through results and display them on the dom.
    function resultsLoop(data) {
        $.each(data.items, function (i, item) {

            var thumb = item.snippet.thumbnails.medium.url;
            var title = item.snippet.title;
            var vid = item.id.videoId;

            if (item.snippet.description.length > 100) {
                var desc = item.snippet.description.substring(0, 100) + ' ...';
            } else {
                var desc = item.snippet.description;
            }

            $('main').append(`
            <article id="item${i + 1}" class="item" data-key="${vid}">
                <div class="thumb-container">
                    <img src="${thumb}" class="thumb">
                </div>
                <div class="vid-details">
                    <h1>${title}</h1>
                    <p class="description">${desc}</p>
                </div>
            </article>`);
        });
    }

    // Select Video Function
    function displayVid(id) {
        $('#video').html(`<iframe class="video" src="https://www.youtube.com/embed/${id}?rel=0&amp;controls=1&amp&amp;showinfo=0&amp;modestbranding=0" frameborder="0" allowfullscreen></iframe>`);
    }


    //--------------------
    // Aspect ratio for video
    //-------------------- 
    var $allVideos = $("iframe[src^='//www.youtube.com'], object, embed"),
        $fluidEl = $("figure");

    $allVideos.each(function () {

        $(this)
            // jQuery .data does not work on object/embed elements
            .attr('data-aspectRatio', this.height / this.width)
            .removeAttr('height')
            .removeAttr('width');
    });

    $(window).resize(function () {

        var newWidth = $fluidEl.width();
        $allVideos.each(function () {
            var $el = $(this);
            $el
                .width(newWidth)
                .height(newWidth * $el.attr('data-aspectRatio'));
        });
    }).resize();
});
