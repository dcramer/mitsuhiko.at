var DEFAULT_FONT = "Baloo Bhai";

var DEFAULT_TEXT_ALIGN = "center";

var DEFAULT_TEXT = "hi armin!";

var CORE_BOX_CONFIG = [
  { width: 280, height: 445, x: 772, y: 815, rotate: "9.5deg" },
  { width: 265, height: 440, x: 1090, y: 925, rotate: "5deg" },
  { width: 250, height: 440, x: 1370, y: 950, rotate: "1deg" },
  { width: 245, height: 410, x: 1655, y: 870, rotate: "0" },
  { width: 245, height: 410, x: 1925, y: 845, rotate: "0" },
  { width: 245, height: 420, x: 2230, y: 890, rotate: "9deg" },
  { width: 240, height: 400, x: 2540, y: 855, rotate: "-2deg" },
  { width: 245, height: 400, x: 2825, y: 795, rotate: "-2deg" },
  { width: 250, height: 405, x: 3130, y: 815, rotate: "-3.5deg" }
];

var configs = [
  {
    image: "image1.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG
  },
  {
    image: "image2.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG
  },
  {
    image: "image3.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG
  },
  {
    image: "image3.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG,
    imageFilter: "grayscale(100%)"
  },
  {
    image: "image3.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG,
    imageFilter: "invert(100%)",
    textColor: "#fff"
  },
  {
    image: "image3.jpg",
    width: 4032,
    height: 3024,
    boxes: CORE_BOX_CONFIG,
    imageFilter: "sepia(100%)"
  }
];

function MitsuhikoApp() {
  return {
    clearChildren: function(parentNode) {
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
    },

    drawText: function(
      parentNode,
      boxes,
      widthFactor,
      heightFactor,
      text,
      textColor
    ) {
      this.clearChildren(parentNode);

      var numBoxNodes = boxes.length;
      var numTextNodes = text.length;

      var textOffset = 0;
      if (this.textAlign == "center") {
        textOffset =
          numTextNodes < numBoxNodes
            ? parseInt((numBoxNodes - numTextNodes) / 2, 10)
            : 0;
      } else if (this.textAlign == "right") {
        textOffset = numBoxNodes - numTextNodes;
      }

      for (var i = 0, boxConfig, boxNode, textNode; i < numBoxNodes; i++) {
        boxConfig = boxes[i];
        boxNode = document.createElement("div");
        boxNode.style.width = boxConfig.width * widthFactor;
        boxNode.style.height = boxConfig.height * heightFactor;
        boxNode.style.left = boxConfig.x * widthFactor;
        boxNode.style.top = boxConfig.y * heightFactor;
        boxNode.style.color = textColor || "#000";
        boxNode.style.transform = "rotate(" + boxConfig.rotate + ")";
        boxNode.style.fontFamily = '"' + this.fontFamily + '", sans-serfi';
        boxNode.style.fontSize = this.fontSize;
        boxNode.className = "letter";

        textNode = document.createElement("div");
        textNode.innerText = text[i - textOffset] || "";
        boxNode.appendChild(textNode);
        parentNode.appendChild(boxNode);
      }
    },

    parseQueryParams: function() {
      var hash = window.location.hash.substr(1);
      var params = {
        text: DEFAULT_TEXT
      };
      if (hash.length) {
        var hashBits = hash.split("&");
        for (var i = 0, param; i < hashBits.length; i++) {
          param = hashBits[i].split("=", 2);
          if (param.length == 2) {
            params[param[0]] = window.decodeURIComponent(param[1]);
          } else {
            params.text = window.decodeURIComponent(param[0]);
          }
        }
        if (params.buff === "1") params.config = 2;
        else if (params.poland === "1") params.config = 0;
        else if (params.grayscale === "1") params.config = 3;
        else if (params.invert === "1") params.config = 4;
        else if (params.sepia === "1") params.config = 5;
      }
      params.text = params.text.split("|");
      return params;
    },

    randomChoice: function(choices) {
      var index = Math.floor(Math.random() * choices.length);
      return choices[index];
    },

    bindConfigFromParams: function() {
      var params = this.parseQueryParams();
      this.textAlign = params.textAlign || DEFAULT_TEXT_ALIGN;
      this.fontFamily = params.fontFamily || DEFAULT_FONT;
      this.fontSize = params.text.length > 1 ? "3vmax" : "6vmax";
      return params;
    },

    init: function(configs, parentNode) {
      var params = this.bindConfigFromParams();
      if (!parentNode) {
        parentNode = document.body;
      }

      this.rootContainer = document.createElement("div");
      this.rootContainer.className =
        params.text.length > 1 ? "root two-col" : "root";
      parentNode.appendChild(this.rootContainer);

      for (var i = 0; i < params.text.length; i++) {
        this.renderOneConfig(this.rootContainer, params, params.text[i]);
      }

      window.onhashchange = function() {
        var params = this.bindConfigFromParams();
        this.clearChildren(this.rootContainer);
        this.rootContainer.className =
          params.text.length > 1 ? "root two-col" : "root";
        for (var i = 0; i < params.text.length; i++) {
          this.renderOneConfig(this.rootContainer, params, params.text[i]);
        }
      }.bind(this);
    },

    renderOneConfig(parentNode, params, text) {
      var config;
      if (params.config !== undefined) {
        config = configs[params.config];
      } else {
        config = this.randomChoice(configs);
      }

      var containerNode = document.createElement("div");
      containerNode.className = "container";
      parentNode.appendChild(containerNode);

      var lettersNode = document.createElement("div");
      lettersNode.className = "letters";
      containerNode.appendChild(lettersNode);

      var imageNode = document.createElement("img");
      imageNode.onload = function() {
        var widthFactor = imageNode.width / config.width;
        var heightFactor = imageNode.height / config.height;

        this.drawText(
          lettersNode,
          config.boxes,
          widthFactor,
          heightFactor,
          text,
          config.textColor
        );

        window.onresize = function() {
          this.drawText(
            lettersNode,
            config.boxes,
            widthFactor,
            heightFactor,
            text,
            config.textColor
          );
        }.bind(this);
      }.bind(this);
      imageNode.className = "background";
      containerNode.appendChild(imageNode);

      imageNode.src = config.image;
      imageNode.style.filter = config.imageFilter || "none";
    }
  };
}

window.onload = function() {
  var app = MitsuhikoApp();
  app.init(configs);
};
