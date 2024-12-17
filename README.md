# YouGuide Widget Integration

## Overview

The **YouGuide Widget** is an embeddable tool that provides a seamless experience for displaying guides and allowing users to purchase them. This widget fetches guide data, displays a card for each guide, and provides a modal for users to enter their details (name and email) to proceed with the purchase. The widget is highly customizable, allowing you to change the primary color and the border radius of the components.

This guide will walk you through the steps of integrating the widget into your website.

## Features

- **Search Functionality**: Allows users to filter guides by city, country, and language.
- **Guide Cards**: Displays essential information about each guide, including the city, country, and a "Buy Guide" button.
- **Modal Form**: When users click "Buy Guide", a modal pops up to collect the user’s name and email.
- **Customizable**: The widget's primary color and border radius can be easily modified.
- **Responsive**: The widget is designed to work seamlessly across different screen sizes.

## Requirements

Before using the YouGuide Widget, ensure that:

- Your project includes **jQuery**.
- You have downloaded the required **CSS** and **JavaScript** files, which you can find in the repository.

### Download Required Files

1. **Download the CSS and JavaScript files** from the repository or clone the project to your local machine:

    - **CSS file**: `youguide.css`  
    - **JS file**: `widget.js`

	clone the repository:

    ```bash
    git clone https://github.com/msuleman526/youguide-widget.git
    ```

    After cloning, you'll find the necessary files in the `dist` folder.

### Add jQuery

Ensure that **jQuery** is included in your webpage before initializing the widget. You can include jQuery from a CDN:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

### How to Add Widget
To integrate the YouGuide Widget into your website, follow these simple steps:

1. Add CSS and JS to Your HTML
To integrate the widget into your website, include the youguide.css file in the <head> section of your HTML. Then, place the widget.js script and widget initialization code before the closing </body> tag.

## How to Integrate the Widget

To integrate the YouGuide Widget into your website, follow these simple steps:

### 1. Add CSS and JS to Your HTML

To integrate the widget into your website, include the `youguide.css` file in the `<head>` section of your HTML. Then, place the `widget.js` script and widget initialization code before the closing `</body>` tag.

#### Example of Full HTML Setup:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YouGuide Widget Integration</title>
    <!-- Include the widget CSS -->
    <link rel="stylesheet" href="path/to/youguide.css" />
  </head>
  <body>
    <!-- Widget Container -->
    <div id="youguide-content"></div>

    <!-- Include widget JS -->
    <script src="path/to/widget.js"></script>
    <script>
      $(document).ready(function () {
        YouGuideWidget.init({
          primaryColor: "#28a745",  // Set the primary color (e.g., green)
          borderRadius: "8px",      // Set border radius for widget elements
        });
      });
    </script>
  </body>
</html>
```

### 2. Widget Initialization

In the example above, the `YouGuideWidget.init()` function is called to initialize the widget. You can customize the widget with the following options:

- **primaryColor**: This option allows you to set the primary color of the widget (used for buttons, cards, etc.).
- **borderRadius**: Set the border radius for the widget elements (guide cards and modal).

#### Example:

```javascript
YouGuideWidget.init({
  primaryColor: "#ff5733", // Change the primary color to orange
  borderRadius: "10px",     // Set a larger border radius
});
```

### 3. Widget Structure

The widget renders inside a `div` with the ID `youguide-content`, and it automatically handles the fetching and displaying of guide data. Each guide will appear as a card with the following details:

- **City**: The city where the guide is located.
- **Country**: The country of the guide.
- **Language Selection**: A dropdown allowing users to choose their preferred language for the guide.
- **Buy Button**: A button that opens the modal to purchase the guide.

#### Example of Widget Output

Here is an example of how a guide card will look:

- **City**: Paris
- **Country**: France
- **Languages**: English, French, Spanish
- **Buy Guide Button**: When clicked, it opens a modal to capture the user's name and email.

### 4. Modal Form

When users click the **Buy Guide** button, a modal form will appear asking for the user's name and email. The modal will display the description of the selected guide, and users can submit their details to proceed.

## Customization

You can modify the widget's appearance and behavior by updating the following properties in the `YouGuideWidget.init()` method:

- **primaryColor**: This will change the primary color of the widget. For example, set it to `#ff5733` to make the widget orange.
- **borderRadius**: This property controls the roundness of the corners on the widget elements. The higher the value, the more rounded the corners will be.

### Example Customization:

```javascript
YouGuideWidget.init({
  primaryColor: "#ff5733", // Orange color for the widget
  borderRadius: "10px",    // More rounded corners
});
```

### Loading Data from the API

The widget will automatically fetch guide data from the API. If the API call is successful, it will display the guides as cards. If no guides are available or the API fails, the widget will show a message indicating that no guides are available at the moment.

### Error Handling

If there is an issue with the API request or loading the widget, the widget will gracefully handle errors and display an appropriate message to the user.

## Screenshots

Here are some visual examples of how the widget appears:

### Guides

![Guide Card] https://sharedby.blomp.com/7f5yft

### Modal Form

![Modal Form] https://sharedby.blomp.com/7f5yft


## Video Demo

You can watch a video demo of the YouGuide Widget in action here:

[Watch the Demo] https://sharedby.blomp.com/9kz9pq

## Troubleshooting

1. **Guide Not Displaying**: Ensure that jQuery is loaded before `widget.js` in your HTML.
   
   Example:
   ```html
   <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   ```

2. **Styling Issues**: If the widget is not styled correctly, check that the path to `youguide.css` is correct and that it is being loaded properly.