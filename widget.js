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
      if (!$("style#yg-spinner-style").length) {
        $("head").append(`
          <style id="yg-spinner-style">
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `);
      }
    },
    renderSearchField: function () {
      var searchField = `
        <div style="text-align: right; margin: 10px; display: flex; gap: 10px; justify-content: flex-end; align-items: center;">
          <input type="text" id="yg-search" placeholder="Search guides..."
            style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
          <button id="yg-search-btn"
            style="padding: 8px 12px; background: ${this.config.primaryColor}; color: white; border: none; border-radius: 5px;">
            Search
          </button>
          <select id="yg-language" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
            <option value="ar">Arabic</option>
            <option value="zh-cn">Chinese</option>
            <option value="nl">Dutch</option>
            <option value="en" selected>English</option>
            <option value="ja">Japanese</option>
            <option value="it">Italian</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="pl">Polish</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div id="yg-loading" style="display:none; text-align:center; margin-top: 20px;">
          <div class="yg-spinner" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid ${this.config.primaryColor};
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          "></div>
        </div>
      `;
      $("#youguide-content").html(searchField);
      $("#yg-search-btn").on("click", () => this.handleSearch());
      $("#yg-language").on("change", () => this.fetchGuides(true));
    },
    setupModal: function () {
      const modalHtml = `
        <div id="yg-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; align-items: center; justify-content: center;">
          <div id="yg-modal" style="background: white; padding: 20px; border-radius: ${this.config.borderRadius}; width: 300px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
            <h3 style="margin-top: 0;">Enter Your Details</h3>
            <p id="yg-modal-name" style="margin: 10px 0; font-size: 1.2em; font-weight: 500, color: #666;"></p>
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
    showModal: function (guideId, name, description) {
      this.currentGuideId = guideId;
      this.currentPdfName = name;
      $("#yg-modal-description").text(description);
      $("#yg-modal-name").text(name);
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

      // Show spinner
      $("#yg-loading").show();

      const query = $("#yg-search").val() || "";
      const language = $("#yg-language").val() || "en";
      const url = `${this.config.apiBaseUrl}/get-all-guides?page=${this.config.currentPage}&query=${query}&language=${language}`;

      $.get(url, (response) => {
        // Hide spinner
        $("#yg-loading").hide();

        if (response.books?.length) {
          this.config.totalPages = response.totalPages;
          this.renderGuideCards(response.books);
        } else {
          $("#youguide-content").append("<p style='text-align:center;'>No guides found.</p>");
        }
      }).fail(() => {
        $("#yg-loading").hide();
        $("#youguide-content").append("<p style='text-align:center; color: red;'>Failed to load guides.</p>");
      });
    },
    renderGuideCards: function (books) {
      if (!books.length) return;

      var cardsHtml = "<div id='yg-cards'>";

      books.forEach((book) => {
        let des = book.description.replace("'", "")
        console.log(book.description)
        cardsHtml += `
          <div class="yg-card">
            <img src="${book.imagePath}" alt="${book.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 5px;">
            <h3 style="margin: 10px 0; font-size: 1.1em; color: #333;">${book.name}</h3>
            <p style="font-size: 0.9em; color: #666;">Address: ${book.category._id == "672a73fd3ff8e4cf3ba9084f" ? book.city : book.city + ", " + book.country}</p>
            <button class="yg-buy-btn" style="background: ${this.config.primaryColor};" onclick="YouGuideWidget.showModal('${book._id}', '${book.name}', '${des}')">Buy Guide</button>
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
        var loadMoreHtml = `<button id="yg-load-more" style="background: ${this.config.primaryColor};">Load More</button>`;
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
        var url = `${this.config.apiBaseUrl}/get-guide-purchase-link?email=${email}&name=${name}&guide_id=${this.currentGuideId}`;

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
