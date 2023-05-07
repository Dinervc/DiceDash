document.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0,
      0,
      10,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.setPosition(new BABYLON.Vector3(0, 5, -10));

    var light1 = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    var light2 = new BABYLON.PointLight(
      "light2",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );

    var dice;
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./",
      "resources/dice.obj",
      scene,
      function (newMeshes) {
        dice = newMeshes[0];
        dice.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
        dice.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        var diceMaterial = new BABYLON.StandardMaterial("diceMaterial", scene);
        diceMaterial.diffuseTexture = new BABYLON.Texture(
          "resources/diceTexture.webp",
          scene
        );
        diceMaterial.diffuseTexture.uScale = 0.1;
        diceMaterial.diffuseTexture.vScale = 0.1;

        dice.material = diceMaterial;

        var animationBox = new BABYLON.Animation(
          "animationBox",
          "position.y",
          10,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        var keys = [];
        keys.push({ frame: 0, value: -1.2 });
        keys.push({ frame: 20, value: 0 });
        keys.push({ frame: 40, value: -1.2 });
        animationBox.setKeys(keys);

        var animationRotation = new BABYLON.Animation(
          "animationRotation",
          "rotation.y",
          10,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        var keysRotation = [];
        keysRotation.push({ frame: 0, value: 0 });
        keysRotation.push({ frame: 20, value: Math.PI });
        keysRotation.push({ frame: 40, value: Math.PI * 2 });
        animationRotation.setKeys(keysRotation);

        var animationGroup = new BABYLON.AnimationGroup("animationGroup");
        animationGroup.addTargetedAnimation(animationBox, dice);
        animationGroup.addTargetedAnimation(animationRotation, dice);
        animationGroup.play(true);
      }
    );

    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
});
