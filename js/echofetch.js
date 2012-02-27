// echofetch.js

/*
api key: XM60RFNS2GT8X6GV7
sample search: http://developer.echonest.com/api/v4/song/search?api_key=XM60RFNS2GT8X6GV7&format=json&results=100&artist=bomb+the+bass
*/    

var apiKey = 'XM60RFNS2GT8X6GV7';

var searchByArtistUrl = 'http://developer.echonest.com/api/v4/song/search' +
    '?api_key=' + apiKey + 
    '&format=json' +
    '&results=100&' +
    'artist='

var audioSummaryUrl = 'http://developer.echonest.com/api/v4/song/profile' +
    '?api_key=' + apiKey + 
    '&format=json' +
    '&bucket=audio_summary';    
    
$(function() {
    
    var artistInput = $('#artist');    
    artistInput.change(fetchSongs);
    
    // todo: .on() hookups for clicking song title
    
    artistInput.focus();
    
    $('form').submit(fetchSongs);
    
    fetchSongs();
    
});

function fetchSongs() {
    
    var fullSearchUrl = searchByArtistUrl + $('#artist').val();
        
    var resultsDiv = $('#song_results');
        
    resultsDiv.text('Loading...');
        
    $.get(fullSearchUrl, function(data) {
    
        var songs = data.response.songs;
        
        resultsDiv.empty();
        
        $.each(songs, function(idx, song) {
            var songHtml = '<div class="song_result">' +                
                '<span class="artist_name">' + song.artist_name + '</span>' +
                ' &mdash; ' +
                '<a href="javascript:fetchAnalysis(\'' + song.id + '\');" class="song_title">' + song.title + '</a>' +
                '</div>';
            resultsDiv.append(songHtml);
        });
        
    });
        
}

function fetchAnalysis(songId) {

    var fullSummaryUrl = audioSummaryUrl + '&id=' + songId;
    
    var summaryResultsDiv = $('#summary_results');
    
    summaryResultsDiv.text('Loading...');
    
    var trackAnalysisUrl;
    
    $.get(fullSummaryUrl, function(data) {
    
        trackAnalysisUrl = data.response.songs[0].audio_summary.analysis_url;
        summaryResultsDiv.html('<a href="javascript:fetchTrackDetails();">' + trackAnalysisUrl + '</a>');
        
    });
    
}

function fetchTrackDetails() {

    var trackAnalysisUrl = $('#summary_results').text();
    
    var analysisResultsDiv = $('#track_analysis');
    
    analysisResultsDiv.html('Loading... (this might take a minute)<br/><br/>' + trackAnalysisUrl);
    
    $.ajax(trackAnalysisUrl, {
        timeout: 10000,
        success: function(data) {
            alert(data);
        },
        error: function(xhr, errorType, errorObj) {
            if (errorType == 'timeout') {
                alert('request timed out');
            } else {
                alert('non-timeout error: ' + errorType + '\n\n' + xhr.status + xhr.statusText);
            }
        }
    });
    
}