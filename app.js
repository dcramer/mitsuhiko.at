var DEFAULT_FONT = "Baloo Bhai";

var DEFAULT_TEXT_ALIGN = "center";

var DEFAULT_TEXT = "hi armin!";

var DEFAULT_CONFIG = 1;

var DEFAULT_FILTER = 0;

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
  }
];

var filters = [
  {},
  {
    imageFilter: "grayscale(100%)"
  },
  {
    imageFilter: "invert(100%)",
    textColor: "#fff"
  },
  {
    imageFilter: "sepia(100%)"
  },
  {
    imageFilter: "saturate(4)"
  },
  {
    imageFilter: "hue-rotate(90deg)"
  },
  {
    imageFilter: "hue-rotate(180deg)"
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
        text: DEFAULT_TEXT,
        config: DEFAULT_CONFIG,
        filter: DEFAULT_FILTER
      };
      if (hash.length) {
        var hashBits = hash.split("&");
        for (var i = 0, param; i < hashBits.length; i++) {
          param = hashBits[i].split("=", 2);
          if (param.length == 2) {
            params[param[0]] = window.decodeURIComponent(param[1]);
          } else if (param[0].length) {
            params.text = window.decodeURIComponent(param[0]);
          }
        }
        if (params.buff === "1") params.config = "2";
        else if (params.poland === "1") params.config = "0";
        else if (params.grayscale === "1") params.config = "3";
        else if (params.invert === "1") params.config = "4";
        else if (params.sepia === "1") params.config = "5";
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

    getRootContainerClassName: function(params) {
      var className = "root";
      if (params.text.length > 1) className += " two-col";
      if (params.text.length > 2) className += " two-row";
      return className;
    },

    init: function(configs, filters, parentNode) {
      var params = this.bindConfigFromParams();
      if (!parentNode) {
        parentNode = document.body;
      }

      this.rootContainer = document.createElement("div");
      this.rootContainer.className = this.getRootContainerClassName(params);
      parentNode.appendChild(this.rootContainer);

      for (var i = 0; i < params.text.length; i++) {
        this.renderOneConfig(this.rootContainer, params, params.text[i]);
      }

      var configContainer = (this.configContainer = document.createElement(
        "div"
      ));
      configContainer.className = "config-selector";
      parentNode.appendChild(configContainer);
      for (var i = 0, config, configNode, imgNode; i < configs.length; i++) {
        config = configs[i];
        configNode = document.createElement("a");
        configNode.className =
          parseInt(params.config, 10) === i ? "config active" : "config";
        configNode.onclick = function(configNum, e) {
          e.preventDefault();

          var params = this.parseQueryParams();
          params.config = configNum;
          var query = (params.text || []).join("|") + "&";
          for (var key in params) {
            if (key === "text") {
              continue;
            }
            query +=
              encodeURIComponent(key) +
              "=" +
              encodeURIComponent(params[key]) +
              "&";
          }
          window.location.href = "#" + query;
        }.bind(this, i);
        imgNode = document.createElement("img");
        imgNode.src = config.image;
        configNode.appendChild(imgNode);
        configContainer.appendChild(configNode);
      }

      var filterContainer = (this.filterContainer = document.createElement(
        "div"
      ));
      filterContainer.className = "filter-selector";
      parentNode.appendChild(filterContainer);
      for (var i = 0, filter, filterNode, imgNode; i < filters.length; i++) {
        filter = filters[i];
        filterNode = document.createElement("a");
        filterNode.className =
          parseInt(params.filter, 10) === i ? "filter active" : "filter";
        filterNode.onclick = function(filterNum, e) {
          e.preventDefault();

          var params = this.parseQueryParams();
          params.filter = filterNum;
          var query = (params.text || []).join("|") + "&";
          for (var key in params) {
            if (key === "text") {
              continue;
            }
            query +=
              encodeURIComponent(key) +
              "=" +
              encodeURIComponent(params[key]) +
              "&";
          }
          window.location.href = "#" + query;
        }.bind(this, i);
        imgNode = document.createElement("img");
        imgNode.src = configs[parseInt(params.config, 10) || 0].image;
        imgNode.style.filter = filter.imageFilter;
        filterNode.appendChild(imgNode);
        filterContainer.appendChild(filterNode);
      }

      window.onhashchange = function() {
        var params = this.bindConfigFromParams();
        this.clearChildren(this.rootContainer);
        this.rootContainer.className = this.getRootContainerClassName(params);
        for (var i = 0; i < params.text.length; i++) {
          this.renderOneConfig(this.rootContainer, params, params.text[i]);
        }
        var configNodes = this.configContainer.getElementsByClassName("config");
        for (var i = 0; i < configNodes.length; i++) {
          configNodes[i].className =
            parseInt(params.config, 10) === i ? "config active" : "config";
        }
        var filterNodes = this.filterContainer.getElementsByClassName("filter");
        for (var i = 0; i < filterNodes.length; i++) {
          filterNodes[i].className =
            parseInt(params.filter, 10) === i ? "filter active" : "filter";
        }
      }.bind(this);
    },

    renderOneConfig(parentNode, params, text) {
      var config;
      if (params.config !== undefined) {
        config = configs[parseInt(params.config, 10)] || configs[0];
      } else {
        config = this.randomChoice(configs);
      }
      if (params.filter !== undefined) {
        filter = filters[parseInt(params.filter, 10)] || filters[0];
      } else {
        filter = filters[0];
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
          filter.textColor
        );

        window.onresize = function(imageNode) {
          var widthFactor = imageNode.width / config.width;
          var heightFactor = imageNode.height / config.height;

          this.drawText(
            lettersNode,
            config.boxes,
            widthFactor,
            heightFactor,
            text,
            filter.textColor
          );
        }.bind(this, imageNode);
      }.bind(this);
      imageNode.className = "background";
      containerNode.appendChild(imageNode);

      imageNode.src = config.image;
      imageNode.style.filter = filter.imageFilter || "none";
    }
  };
}

window.onload = function() {
  var app = MitsuhikoApp();
  app.init(configs, filters);
};
