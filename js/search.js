jQuery(function() {

  $(".hasclear").keyup(function () {
    var t = $(this);
    t.next('span').toggle(Boolean(t.val()));
  });

  $(".clearer").hide($(this).prev('input').val());

  $(".clearer").click(function () {
    $(this).prev('input').val('').focus();
    $(this).hide();
  });

  // Initialize lunr with the fields to be searched, plus the boost.
  window.idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('author');
    this.field('categories');
  });

  // Get the generated search_data.json file so lunr.js can search it locally.
  window.data = $.getJSON('/search_data.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function(loaded_data){
    $.each(loaded_data, function(index, value){
      window.idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });

  // Event when the form is submitted
  $("#search-form").submit(function(event){
      event.preventDefault();
      var query = $("#search-input").val(); // Get the value for the text field
      var results = window.idx.search(query); // Get lunr to perform a search
      display_search_results(results); // Hand the results off to be displayed
  });

  function display_search_results(results) {
    var $search_results = $("#search-results");

    // Wait for data to load
    window.data.then(function(loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results

        // Iterate over the results
        results.forEach(function(result) {
          var item = loaded_data[result.ref];

          // Build a snippet of HTML for this result
          var appendString = '<h4><a href="' + item.url + '">' + item.title + '</a></h4><p>' + item.excerpt + '</p><a href="' + item.url + '#disqus_thread"></a>';

          // Add the snippet to the collection of results.
          $search_results.append(appendString);
        });

        DISQUSWIDGETS.getCount({reset: true});
      } else {
        // If there are no results, let the user know.
        $search_results.html('<li>No results found.<br/>Please check spelling, spacing, yada...</li>');
      }
    });
  }
});
