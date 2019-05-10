var DEFAULT_FONT = "Baloo Bhai";

var CORE_BOX_CONFIG = [
  { width: 280, height: 445, x: 772, y: 815, rotate: "9.5deg" },
  { width: 265, height: 440, x: 1090, y: 925, rotate: "5deg" },
  { width: 250, height: 440, x: 1370, y: 930, rotate: "1deg" },
  { width: 245, height: 410, x: 1655, y: 863, rotate: "0" },
  { width: 245, height: 410, x: 1925, y: 840, rotate: "0" },
  { width: 245, height: 420, x: 2230, y: 885, rotate: "9deg" },
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
  }
];

function MitsuhikoApp() {
  return {
    clearChildren: function(parentNode) {
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
    },

    drawText: function() {
      this.clearChildren(this.lettersNode);

      var widthFactor = this.imageNode.width / this.config.width;
      var heightFactor = this.imageNode.height / this.config.height;

      var numBoxNodes = this.config.boxes.length;
      var numTextNodes = this.text.length;

      var textOffset = 0;
      if (this.alignText == "center") {
        textOffset =
          numTextNodes < numBoxNodes
            ? parseInt((numBoxNodes - numTextNodes) / 2, 10)
            : 0;
      } else if (this.alignText == "right") {
        textOffset = numBoxNodes - numTextNodes;
      }

      for (var i = 0, boxConfig, boxNode, textNode; i < numBoxNodes; i++) {
        boxConfig = this.config.boxes[i];
        boxNode = document.createElement("div");
        boxNode.style.width = boxConfig.width * widthFactor;
        boxNode.style.height = boxConfig.height * heightFactor;
        boxNode.style.left = boxConfig.x * widthFactor;
        boxNode.style.top = boxConfig.y * heightFactor;
        boxNode.style.transform = "rotate(" + boxConfig.rotate + ")";
        boxNode.style.fontFamily = '"' + this.fontFamily + '", sans-serfi';
        boxNode.style.fontSize = "6vw";
        boxNode.className = "letter";

        textNode = document.createElement("div");
        textNode.innerText = this.text[i - textOffset] || "";
        boxNode.appendChild(textNode);
        this.lettersNode.appendChild(boxNode);
      }
    },

    parseQueryParams: function() {
      var hash = window.location.hash.substr(1);
      var params = {
        text: "mitsuhiko"
      };
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
      return params;
    },

    randomChoice: function(choices) {
      var index = Math.floor(Math.random() * choices.length);
      return choices[index];
    },

    init: function(configs) {
      this.configs = configs;

      var params = this.parseQueryParams();
      this.alignText = params.alignText || "center";
      this.fontFamily = params.fontFamily || DEFAULT_FONT;
      this.text = params.text;

      if (params.config !== undefined) {
        this.config = configs[params.config];
      } else {
        this.config = this.randomChoice(configs);
      }

      var containerNode = (this.containerNode = document.getElementById(
        "container"
      ));
      this.clearChildren(containerNode);

      var lettersNode = (this.lettersNode = document.createElement("div"));
      lettersNode.className = "letters";
      containerNode.appendChild(lettersNode);

      var imageNode = (this.imageNode = this.imageNode = document.createElement(
        "img"
      ));
      imageNode.onload = function() {
        this.drawText();
      }.bind(this);
      imageNode.className = "background";
      containerNode.appendChild(imageNode);

      imageNode.src = this.config.image;

      window.onhashchange = function() {
        var params = this.parseQueryParams();
        this.alignText = params.alignText || "center";
        this.fontFamily = params.fontFamily || DEFAULT_FONT;
        this.text = params.text;
        if (params.config !== undefined) {
          this.config = configs[params.config];
          this.imageNode.onload = function() {
            this.drawText();
          }.bind(this);
          this.imageNode.src = this.config.image;
        } else {
          this.drawText();
        }
      }.bind(this);

      window.onresize = function() {
        this.drawText();
      }.bind(this);
    }
  };
}

window.onload = function() {
  var app = MitsuhikoApp();
  app.init(configs);
};
