(function ($) {
  var YouGuideWidget = {
    config: {
      primaryColor: "#007BFF", // Primary color
      borderRadius: "10px",
      apiBaseUrl: "https://appapi.youguide.com/api",
      currentPage: 1,
      totalPages: 1,
    },
    init: function (options) {
      this.config = $.extend({}, this.config, options);
      this.renderSearchField();
      this.fetchGuides(true); // Initial Load
      this.setupLoadMoreButton();
      this.setupModal(); // Add modal setup
    },
    renderSearchField: function () {
      var searchField = `
        <div style="text-align: right; margin: 10px;">
          <input type="text" id="yg-search" placeholder="Search guides..."
            style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
          <button id="yg-search-btn"
            style="padding: 8px 12px; background: ${this.config.primaryColor}; color: white; border: none; border-radius: 5px;">
            Search
          </button>
        </div>
      `;
      $("#youguide-content").html(searchField);
      $("#yg-search-btn").on("click", () => this.handleSearch());
    },
    setupModal: function () {
      const modalHtml = `
        <div id="yg-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; align-items: center; justify-content: center;">
          <div id="yg-modal" style="background: white; padding: 20px; border-radius: ${this.config.borderRadius}; width: 300px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
            <h3 style="margin-top: 0;">Enter Your Details</h3>
            <p id="yg-modal-description" style="margin: 10px 0; font-size: 0.9em; color: #666;"></p>
            <input id="yg-customer-name" type="text" placeholder="Name" style="width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            <input id="yg-customer-email" type="email" placeholder="Email" style="width: 100%; margin-bottom: 15px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            <button id="yg-confirm-btn" style="padding: 10px; background: ${this.config.primaryColor}; color: white; border: none; border-radius: ${this.config.borderRadius}; width: 100%;">Confirm</button>
            <button id="yg-cancel-btn" style="margin-top: 10px; background: gray; color: white; border: none; padding: 8px; border-radius: ${this.config.borderRadius}; width: 100%;">Cancel</button>
          </div>
        </div>
      `;
      $("body").append(modalHtml);

      $("#yg-cancel-btn").on("click", () => this.hideModal());
      $("#yg-confirm-btn").on("click", () => this.confirmPurchase());
    },
    showModal: function (guideId, pdfId, description) {
      this.currentGuideId = guideId;
      this.currentPdfId = pdfId;
      $("#yg-modal-description").text(description);
      $("#yg-modal-overlay").css("display", "flex");
    },
    hideModal: function () {
      $("#yg-modal-overlay").hide();
      $("#yg-customer-name, #yg-customer-email").val("");
    },
    fetchGuides: function (isNewSearch = false) {
      if (isNewSearch) {
        this.config.currentPage = 1;
        $("#yg-cards").remove();
      }
      var query = $("#yg-search").val() || "";
      var url = `${this.config.apiBaseUrl}/get-all-guides?page=${this.config.currentPage}&query=${query}`;

      $.get(url, (response) => {
        if (response.books) {
          var books = response.books;
          this.config.totalPages = response.totalPages;
          this.renderGuideCards(books);
        } else {
          $("#yg-loading").text("No guides found.");
        }
      });
    },
    renderGuideCards: function (books) {
      if (!books.length) return;

      var cardsHtml = "<div id='yg-cards'>";

      books.forEach((book) => {
        cardsHtml += `
          <div class="yg-card">
            <img src="https://appapi.youguide.com/${book.imagePath}" alt="${book.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 5px;">
            <h3 style="margin: 10px 0; font-size: 1.1em; color: #333;">${book.name}</h3>
            <p style="font-size: 0.9em; color: #666;">City: ${book.city}</p>
            <p style="font-size: 0.9em; color: #666;">Country: ${book.country}</p>
            <select class="yg-pdf-select">
              ${book.pdfFiles.map((pdf) => `<option value="${pdf._id}">${pdf.language}</option>`).join("")}
            </select>
            <button class="yg-buy-btn" onclick="YouGuideWidget.showModal('${book._id}', document.querySelector('.yg-pdf-select').value, '${book.description}')">Buy Guide</button>
          </div>
        `;
      });

      cardsHtml += "</div>";
      $("#youguide-content").append(cardsHtml);
      this.setupLoadMoreButton();
    },
    setupLoadMoreButton: function () {
      // Remove any existing "Load More" button before appending a new one
      $("#yg-load-more").remove();
      
      // Only append a new "Load More" button if there are more pages to load
      if (this.config.currentPage < this.config.totalPages) {
        var loadMoreHtml = `<button id="yg-load-more">Load More</button>`;
        $("#youguide-content").append(loadMoreHtml);
        $("#yg-load-more").on("click", () => this.loadMoreGuides());
      }
    },
    loadMoreGuides: function () {
      this.config.currentPage++;
      this.fetchGuides();
    },
    handleSearch: function () {
      this.fetchGuides(true);
    },
    confirmPurchase: function () {
      var name = $("#yg-customer-name").val();
      var email = $("#yg-customer-email").val();
      if (name && email) {
        // Make API call to confirm purchase
        var url = `${this.config.apiBaseUrl}/get-guide-purchase-link?email=${email}&name=${name}&guide_id=${this.currentGuideId}&pdf_id=${this.currentPdfId}`;
        
        $.get(url, (response) => {
          if (response.url) {
            // Open the URL in a new tab
            window.open(response.url, "_blank");
            this.hideModal(); // Hide the modal after confirmation
          } else {
            alert("Failed to fetch purchase link.");
          }
        });
      } else {
        alert("Please fill in all fields.");
      }
    }
  };

  window.YouGuideWidget = YouGuideWidget;
})(jQuery);
