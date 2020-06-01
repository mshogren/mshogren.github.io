// Initialize lunr with the fields to be searched, plus the boost.
window.data = new Promise(function (resolve, reject) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/search_data.json');

  xhr.onload = function () {
    if (xhr.status === 200) {
      resolve(JSON.parse(xhr.response));
    } else {
      reject(Error(xhr.statusText));
    }
  };

  xhr.onerror = function () {
    reject(Error('Network Error'));
  };

  xhr.send();
});

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/npm/lunr@0.7.1/lunr.min.js'; //,npm/bootstrap.native@2.0.15/dist/bootstrap-native.min.js';
script.onload = function () {
  var index = JSON.parse(localStorage.getItem('searchIndex'));
  if (index && index.expires > Date.now()) {
    window.idx = lunr.Index.load(JSON.parse(index.data))
  } else {
    window.data.then(function (loadedData) {
      if (window.Worker) {
        var worker = new Worker("/js/worker.js");
        worker.onmessage = function (e)
        {
          window.idx = lunr.Index.load(JSON.parse(e.data))
          worker.terminate();
          localStorage.setItem('searchIndex', JSON.stringify({expires: Date.now() + 300000, data: e.data}));
        }
        worker.postMessage(loadedData);
      } else {
        window.idx = lunr(function () {
          this.field('id');
          this.field('title', { boost: 10 });
          this.field('content');
          this.field('author');
          this.field('categories');
          this.field('comments');
        });
        Object.keys(loadedData).forEach(function (key) {
          window.idx.add(Object.assign({ id: key }, loadedData[key]));
        });
      }
    });
  }
};

document.body.appendChild(script);

function displaySearchResults(results) {
  const searchResults = document.querySelector('div.search-results');

  // Wait for data to load
  window.data.then(function (loadedData) {
    // Are there any results?
    if (results.length) {
      searchResults.innerHTML = ''; // Clear any old results

      // Iterate over the results
      results.forEach(function (result) {
        const item = loadedData[result.ref];

        // Build a snippet of HTML for this result
        const heading = document.createElement('h4');
        const link = document.createElement('a');
        link.setAttribute('href', item.url);
        link.append(item.title);
        heading.appendChild(link);
        searchResults.appendChild(heading);

        const text = document.createElement('p');
        text.append(item.excerpt);
        searchResults.appendChild(text);

        const comments = document.createElement('a');
        comments.setAttribute('href', item.url + '#comments');
        comments.append(item.commentcount + ' Comments');
        searchResults.appendChild(comments);
      });
    } else {
      // If there are no results, let the user know.
      searchResults.innerHtml = '<li>No results found.<br/>Please check spelling, spacing, yada...</li>';
    }
  });
}

const searchInput = document.querySelector('#search-input');

function search() {
  const query = searchInput.value;
  const results = window.idx.search(query);
  displaySearchResults(results);
}

const searchClear = document.createElement('span');
searchClear.id = 'search-clear';
searchClear.setAttribute('class', 'glyphicon glyphicon-remove form-control-feedback search-results');

searchInput.parentElement.appendChild(searchClear);

document.querySelectorAll('.search-results').forEach(function (element) {
  element.style.display = 'none';
});

searchInput.addEventListener('keyup', function () {
  const t = Boolean(searchInput.value);
  document.querySelectorAll('.search-results').forEach(function (element) {
    element.style.display = t ? '' : 'none';
  });
  document.querySelectorAll('.main-content').forEach(function (element) {
    element.style.display = !t ? '' : 'none';
  });
  search();
});

document.querySelector('#search-clear').addEventListener('click', function () {
  const input = document.querySelector('#search-clear').previousElementSibling;
  input.value = '';
  input.focus();
  document.querySelectorAll('.search-results').forEach(function (element) {
    element.style.display = 'none';
  });
  document.querySelectorAll('.main-content').forEach(function (element) {
    element.style.display = '';
  });
});

document.querySelector('#search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  search();
});
