const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var bckImage, bck, bck2, bckImage2, house, houseImage;

var nemo, nemoImage,nemoBody;
var marlin, marlinImage;

var net, netImage;

var sharkImage, jellyImage, octopusImage;

var sharkGroup, jellyGroup, octopusGroup;

var gameOver, gameOverImage;

var restart, restartImage;

var gameState = "start";

var music;

var marlinLife = 3;

var score = 0;

localStorage["HighestScore"] = 0;

function preload() {

  bckImage = loadImage("images/bck1.jpg");
  bckImage2 = loadImage("images/fishTank4.jpg");
  bckImage3 = loadImage("images/dentistBck.jpg");
  nemoImage = loadImage("images/nemo.png");
  sharkImage = loadImage("images/shark.png");
  jellyImage = loadImage("images/jelly.png");
  octopusImage = loadImage("images/octopus.png");
  marlinImage = loadImage('images/marlin.png');
  netImage = loadImage("images/net.png");
  gameOverImage = loadImage("images/gameOver.jpg");
  restartImage = loadImage("images/restart.png");


  music = loadSound("sounds/bensound-funkyelement.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  bck = createSprite(width / 2, height / 2 , width, height);
  bck.shapeColor = rgb(0, 83, 203);
  bck.addImage("bckImage", bckImage);
  bck.addImage("bckImage3", bckImage3);
  bck.scale = 1.6;

 
  bck2 = createSprite(width / 2+400, height / 2+200 , width, height);
  bck2.shapeColor = rgb(0, 83, 203);
  bck2.addImage("bckImage2", bckImage2);
  bck2.scale = 0.6;
  bck2.visible = false;


  nemo = createSprite(550, 300);
  nemo.addImage("nemo", nemoImage);
  nemo.scale = 0.6;
  nemo.setCollider("circle", 0, 0, 10);
  nemo.visible = false;

  marlin = createSprite(400, 300);
  marlin.addImage("marlin", marlinImage);
  marlin.scale = 0.8;
  marlin.setCollider("circle", 0, 0, 10);

  net = createSprite(width - 100, 190);
  net.addImage("net", netImage);
  net.visible = false;
  net.scale = 1.3;
  net.setCollider("circle", 50, 100, 50);

  gameOver = createSprite(camera.x + 300, camera.y - 100);
  gameOver.addImage("gameover", gameOverImage);
  gameOver.visible = false;

  restart = createSprite(camera.x + 300, camera.y + 200);
  restart.addImage("restart", restartImage);
  restart.visible = false;

  nemoBody = Bodies.rectangle(850,500,50,50);
  World.add(world,nemoBody);


  sharkGroup = new Group();
  jellyGroup = new Group();
  octopusGroup = new Group();

  music.loop();
}

function draw() {
  background(0, 83, 203);

  drawSprites();


  Engine.update(engine);

  if (gameState === "start") {

    bck.velocityX = -10;

    if (bck.x < 0)
      bck.x = bck.width / 2;

    nemo.visible = true;

    textSize(30);
    fill("blue");
    text("Mario and his son Nemo are having a great day.", width / 2 - 100, height / 2);
    text("Press 'Y' to see what happens next.", width / 2 - 50, height / 2 + 100);

    if (keyDown("y"))
      gameState = "story";

  }

  if (gameState === "story") {

    bck.velocityX = -10;

    if (bck.x < 0)
      bck.x = bck.width / 2;

    nemo.visible = true;
    net.visible = true;

    net.velocityX = -10;

    if (net.isTouching(nemo)) {

      nemo.velocityY = -10;
      net.velocityY = -10;
      net.velocityX = 0;
      bck.velocityX = 0;

      net.lifetime = 50;
      gameState = "story2";
    }

  }
  if (gameState === "story2") {

    textSize(50);
    fill("blue");
    text("OH NO! HELP ME FIND MY SON NEMO PLEASE!!", 100, 500);
    textSize(30);
    text("You can hide behind the octopuses and do not touch stinky jelly fishes and scary sharks!!", 100, 550);
    text("Use keys to move me.", 520, 600);
    text("Press 'Space' to help me.", 500, 650);

    if (keyDown("Space"))
      gameState = "level1";
  }

  if (gameState === "level1") {

    if (second() === 1) {
      gameState = "level2";
    }

    textSize(30);
    fill("blue");
    text("Marlin life left: " + marlinLife, camera.x + 230, camera.y - 300);

    text("Score: " + score, camera.x + 230, camera.y - 250);

    score = score + Math.round(getFrameRate() / 60);

    bck.velocityX = -10;

    camera.x = marlin.x;
    camera.y = marlin.y;

    if (bck.x < 0)
      bck.x = bck.width / 2;


    if (keyDown("up")) {
      marlin.y = marlin.y - 10;
    }

    else if (keyDown("down")) {
      marlin.y = marlin.y + 10;
    }

    else if (keyDown("left")) {
      marlin.x = marlin.x - 10;
    }

    else if (keyDown("right")) {
      marlin.x = marlin.x + 10;
    }

    spawnJellyFish();
    spawnSharks();
    spawnOctopus();

    if (octopusGroup.isTouching(marlin)) {
      octopusGroup.x = bck.x;
      octopusGroup.y = bck.y;
    }

    else if (marlin.isTouching(sharkGroup) || marlin.isTouching(jellyGroup)) {
      gameState = "end";
    }

  }

  if (gameState === "level2") {
    
    bck.changeImage("bckImage3", bckImage3);
    bck2.visible = true;
    marlin.visible = false;
   // console.log(nemoBody)
    image(nemoImage,nemoBody.position.x, nemoBody.position.y,100,100)
 
    
  }


  if (gameState === "end") {

    textSize(30);
    fill("blue");
    text("Score: " + score, camera.x + 230, camera.y - 250);

    gameOver.x = camera.x
    gameOver.y = camera.y - 100;

    restart.x = camera.x;
    restart.y = camera.y + 200;

    nemo.velocityX = 0;
    sharkGroup.setVelocityXEach(0);
    jellyGroup.setVelocityXEach(0);

    sharkGroup.destroyEach();
    jellyGroup.destroyEach();

    bck.velocityX = 0;

    gameOver.visible = true;

    if (marlinLife > 0)
      restart.visible = true;

    music.stop();

    if (mousePressedOver(restart)) {

      if (localStorage["HighestScore"] < score)
        localStorage["HighestScore"] = score;

      console.log("Highest score: " + localStorage["HighestScore"]);

      score = 0;

      if (marlinLife > 0) {
        marlinLife = marlinLife - 1;
        music.play();
      }
      else
        marlinLife = 0;

      gameOver.visible = false;
      restart.visible = false;

      gameState = "level1";
    }

  }
}
function spawnSharks() {
  if (frameCount % 130 === 0) {
    var shark = createSprite(width, random(camera.y));
    shark.addImage("shark", sharkImage);
    shark.velocityX = -(10 + score / 6);
    shark.scale = 1.5;
    shark.lifetime = width / 10;
    sharkGroup.add(shark);
  }
}

function spawnJellyFish() {
  if (frameCount % 200 === 0) {
    var jelly = createSprite(width, random(camera.y));
    jelly.addImage("jelly", jellyImage);
    jelly.scale = 0.3;
    jelly.velocityX = -(10 + score / 6);
    jelly.lifetime = width / 10;
    jellyGroup.add(jelly);
  }
}



function spawnOctopus() {
  if (frameCount % 500 === 0) {
    var octopus = createSprite(width, random(camera.y));
    octopus.addImage("octopus", octopusImage);
    octopus.velocityX = -10;
    octopus.lifetime = width / 10;
    octopusGroup.add(octopus);

    octopus.depth = 3;
    marlin.depth = 2;
  }
}
