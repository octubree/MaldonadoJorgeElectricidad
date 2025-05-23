// Modificación del archivo lunr-search.js para mejorar la funcionalidad SEO
window.addEventListener("DOMContentLoaded", function(indexUrl) {
  let index = null;
  let lookup = null;
  let queuedTerm = null;
  let queuedDoNotAddState = false;
  let origContent = null;

  const form = document.getElementById("search");
  const input = document.getElementById("search-input");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    let term = input.value.trim();
    if (!term) {
      return;
    }
    
    // Redireccionar a la página de búsqueda con URL limpia
    window.location.href = "/buscar/?q=" + encodeURIComponent(term);
  }, false);

  // Mantener la funcionalidad original para búsquedas en otras páginas
  if (window.location.pathname !== "/buscar/" && window.location.pathname !== "/buscar/index.html") {
    if (history.state && history.state.type == "search") {
      startSearch(history.state.term, true);
    }

    window.addEventListener("popstate", function(event) {
      if (event.state && event.state.type == "search") {
        startSearch(event.state.term, true);
      }
      else if (origContent) {
        let target = document.querySelector(".container[role=main]");
        while (target.firstChild) {
          target.removeChild(target.firstChild);
        }

        for (let node of origContent) {
          target.appendChild(node);
        }
        origContent = null;
      }
    }, false);
  }

  function startSearch(term, doNotAddState) {
    input.value = term;
    form.setAttribute("data-running", "true");
    if (index) {
      search(term, doNotAddState);
    }
    else if (queuedTerm) {
      queuedTerm = term;
      queuedDoNotAddState = doNotAddState;
    }
    else {
      queuedTerm = term;
      queuedDoNotAddState = doNotAddState;
      initIndex();
    }
  }

  function searchDone() {
    form.removeAttribute("data-running");

    queuedTerm = null;
    queuedDoNotAddState = false;
  }

  function initIndex() {
    let request = new XMLHttpRequest();
    request.open("GET", indexUrl);
    request.responseType = "json";
    request.addEventListener("load", function(event) {
      let documents = request.response;
      if (!documents)
      {
        console.error("Search index could not be downloaded.");
        searchDone();
        return;
      }

      lookup = {};
      index = lunr(function() {
        const language = document.documentElement.getAttribute("lang") || "es";
        if (language.length > 2)
          language = language.slice(0, 2);
        if (language != "en" && lunr.hasOwnProperty(language)) {
          this.use(lunr[language]);
        }

        this.ref("uri");
        this.field("title", { boost: 10 });
        this.field("subtitle", { boost: 5 });
        this.field("content");
        this.field("description", { boost: 5 });
        this.field("categories", { boost: 3 });
        this.field("tags", { boost: 3 });

        for (let document of documents) {
          this.add(document);
          lookup[document.uri] = document;
        }
      });

      search(queuedTerm, queuedDoNotAddState);
    }, false);
    request.addEventListener("error", searchDone, false);
    request.send(null);
  }

  function search(term, doNotAddState) {
    try {
      let results = index.search(term);

      let target = document.querySelector(".container[role=main]");
      let replaced = [];
      while (target.firstChild) {
        replaced.push(target.firstChild);
        target.removeChild(target.firstChild);
      }
      if (!origContent) {
        origContent = replaced;
      }

      let titleTemplate = document.getElementById("search-heading");
      let titleElement = titleTemplate.content.cloneNode(true);

      let title = titleElement.querySelector(".search-title");
      if (results.length == 0) {
        title.textContent = titleTemplate.getAttribute("data-results-none").replace("{}", term);
      }
      else if (results.length == 1) {
        title.textContent = titleTemplate.getAttribute("data-results-one").replace("{}", term);
      }
      else {
        title.textContent = titleTemplate.getAttribute("data-results-many").replace("{}", term).replace("13579", results.length);
      }
      target.appendChild(titleElement);
      document.title = title.textContent;

      let template = document.getElementById("search-result");
      for (let result of results) {
          let doc = lookup[result.ref];

          let element = template.content.cloneNode(true);
          element.querySelector(".summary-title-link").href = element.querySelector(".read-more-link").href = doc.uri;
          element.querySelector(".summary-title-link").textContent = doc.title;
          element.querySelector(".post-entry").textContent = truncateToEndOfSentence(doc.content, 70);
          target.appendChild(element);
      }
      title.scrollIntoView(true);

      if (!doNotAddState) {
          history.pushState({type: "search", term: term}, title.textContent, "#search=" + encodeURIComponent(term));
      }

      let menuToggler = document.querySelector(".navbar-toggler");
      if (menuToggler && !menuToggler.classList.contains("collapsed")) {
        menuToggler.click();
      }
    }
    finally {
      searchDone();
    }
  }

  // This matches Hugo's own summary logic:
  // https://github.com/gohugoio/hugo/blob/b5f39d23b86f9cb83c51da9fe4abb4c19c01c3b7/helpers/content.go#L543
  function truncateToEndOfSentence(text, minWords)
  {
      let match;
      let result = "";
      let wordCount = 0;
      let regexp = /(\S+)(\s*)/g;
      while (match = regexp.exec(text)) {
          wordCount++;
          if (wordCount <= minWords) {
              result += match[0];
          }
          else
          {
              let char1 = match[1][match[1].length - 1];
              let char2 = match[2][0];
              if (/[.?!"]/.test(char1) || char2 == "\n") {
                  result += match[1];
                  break;
              }
              else {
                  result += match[0];
              }
          }
      }
      return result;
  }
}.bind(null, document.currentScript.getAttribute("data-index")), {once: true});
