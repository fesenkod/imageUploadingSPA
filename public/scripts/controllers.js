imageUploadApp.controller("imageUploadCtrl", function ($scope, $http) {
  $scope.template = "signIn";
  $scope.navTemplate = "unsigned";
  $scope.changeTemplate = function (name) {
    $scope.template = name;
  };
  $http.get("users.json").then(function(response) {
        $scope.users = response.data;
    });

  $scope.sign = function (mail, passw) {
    for (var i = 0; i < $scope.users["Users"].length; i++) {
      if ($scope.users["Users"][i].email == mail && $scope.users["Users"][i].password == passw) {
        $scope.template = "blocks";
        $scope.navTemplate = "signed";
        localStorage.setItem('currentUser', JSON.stringify($scope.users["Users"][i]));
      };
    };
  };

  $scope.signOut = function () {
    localStorage.setItem('currentUser', "");
    $scope.changeTemplate("signIn");
    $scope.navTemplate = "unsigned";
  }
});


imageUploadApp.controller("uploadCtrl", function($scope) {
  $scope.makeDroppable = function (element, callback) {

    // handling clicking
    element.after("<input type='file' multiple='true'>");
    $("input[type='file']").css("display", "none");

    element.on('click', function() {
      $("input").val(null);
      $("input").click();
    });

    $("input").on('change', triggerCallback);

    // handling drag&drop
    element.on('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    });

    element.on('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    });

    element.on('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    triggerCallback(e);
    });

  function triggerCallback(e) {
    var files;
    if(e.originalEvent.dataTransfer) {
      files = e.originalEvent.dataTransfer.files;
    } else if(e.target) {
      files = e.target.files;
    };

    callback.call(null, files);
  };
};

$scope.pictures = [];
$scope.index = 0;
$scope.element = $('#dropZone');
$scope.callback = function (files) {
  for (var i = 0; i < files.length; i++) {
    $scope.pictures.push({name: files[i].name, size: files[i].size});
    var reader = new FileReader();
    reader.onload = function(event) {
      var name = $scope.pictures[$scope.index].name;
      var size = $scope.pictures[$scope.index].size;
      $scope.index++;
      var dataUri = event.target.result;
      $("#previewDiv").append("<div class='col-xs-3'><img></div>");
      $("img").last().attr("src", dataUri).css("width", "100%").parent()
      .append("<span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span>")
      .append("<p>" + name + "</p").append("<p>" + size/1000 + " kB </p");

      $("#previewDiv span").last().on("click", function (e) {
        e.stopPropagation();
        $(e.target).parent().remove();
      });
    };
    reader.readAsDataURL(files[i]);
    };
  };

$scope.makeDroppable($scope.element, $scope.callback);

$scope.save = function () {
  var imgObjects = [];
  // Get all necessary data about chosen images and push them into an array
  $('img').each(function functionName(i, image) {
    var imgObject = {
      'id': i,
      'imageName': $(image).next("p").text(),
      'fileSize': $(image).next("p").next("p").text(),
      'link': $(image).attr("src"),
      'uploadedUser': JSON.parse(localStorage.getItem('currentUser'))["Id"]
    };
    imgObjects.push(imgObject);
  });
  // Append or create currentUser object in localStorage with list of chosen images
  if (JSON.parse(localStorage.getItem('currentUser'))["imageList"]) {
    var userObj = JSON.parse(localStorage.getItem('currentUser'));
    for (var i = 0; i < imgObjects.length; i++) {
      userObj["imageList"].push(imgObjects[i]);
    };
    localStorage.setItem('currentUser', JSON.stringify(userObj));
  }
  else {
    var imageList = [];
    for (var i = 0; i < imgObjects.length; i++) {
      imageList.push(imgObjects[i]);
    };
    var userObj = JSON.parse(localStorage.getItem('currentUser'));
    userObj["imageList"] = imageList;
    localStorage.setItem('currentUser', JSON.stringify(userObj));
  };
  $scope.changeTemplate('blocks');
};

$(document).ready(function () {
  $(".buttons button").first().on("click", function (e) {
    $("#previewDiv").empty();
  });
});

});



imageUploadApp.controller("blocksCtrl", function($scope) {
  $(document).ready(function () {
    var images = JSON.parse(localStorage.getItem('currentUser'))["imageList"];
    if (images) {
      for (var i = 0; i < images.length; i++) {
        $(".blocksView").append("<img>");
        var source = images[i]["link"];
        $(".blocksView img").last().attr("src", source);
      };
    };
  });
});
