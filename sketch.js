var bg, bgImage;
var groundImage, ground;
var mario, marioAn;
var obs1,obs2,obs3,obs4, obstacle, obstacleGroup;
var die, jump;
var res, resetImage;
var points,point1,point2,point3, pointGroup;
var sanitizer, sanitizerImage;
var immunity, immunityGroup;
var happy, sad, shocked;
var hosp,hospImage;
var gameState = 'START';
var video;
var score = 0;
var sanitizerCount = 1000;
var immunityScore = 3;
var s = 1.6;

function preload() {

  marioAlive = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  bgImage = loadImage("background.png");
  groundImage = loadImage('ground.png');
  marioDead = loadAnimation('collided.png');
  obs1=loadImage('corona1.png');
  obs2=loadImage('corona2.png');
  obs3=loadImage('boy.png');
  obs4=loadImage('girl.png');

  point1 = loadImage('cherry.png');
  point2 = loadImage('banana.png');
  point3 = loadImage('lemon.png');
  
  jump = loadSound('jump.mp3');
  die = loadSound('die.mp3');
  resetImage = loadImage('restart.png');

  sanitizerImage = loadImage('sanitizer-5032551_1280.png');

  happy = loadImage('happy.png');
  sad = loadImage('sad.png');
  shocked = loadImage('shocked.png');
  
  hospImage=loadImage('hospital-5025895_1920.png');

  video1 = createVideo('CovidVideo.mp4');
  video1.size(800, 400);
  


}

function setup() {

  createCanvas(window.width, window.height);

  bg = createSprite(window.width/2, window.height/2, 900, 500);
  bg.addImage(bgImage);
  bg.scale = 1.6;


  mario = createSprite(50, 300, 10, 100);
  mario.scale = 1.6;
  mario.addAnimation('alive', marioAlive);
  mario.addAnimation('dead', marioDead);
 
  
  ground = createSprite(450, 380, 900, 50);
  ground.addImage(groundImage);

  res = createSprite(400, 200, 20, 20);
  res.addImage(resetImage);

  hosp=createSprite(650,230,10,100);
  
  hosp.addImage(hospImage);
  hosp.visible=false;
  hosp.scale=0.1;
   
  
 
  obstacleGroup = new Group();
  pointGroup = new Group();
  sanitizerGroup = new Group();
  immunityGroup = new Group();



  createImmunity();



}

function draw() {

   if(gameState==='START'){

     if(keyDown("enter")){
       video1.play();
       gameState='LOAD';
     }
  }

  if (gameState === 'LOAD') {

    video1.onended(changeState)//When the video has ended call changeState function
  }
 


    if (gameState === 'PLAY') {

      res.visible = false;//Making reset Invisible
      ground.velocityX = -4;
      bg.velocityX = -4;

      if (keyDown('space') && mario.y>320) {

        mario.velocityY = -12;
        jump.play();

      }

      mario.velocityY = mario.velocityY + 0.6;

      if (ground.x < 0) {
        ground.x = ground.width / 2;
      }

      if (bg.x < 0) {
        bg.x = bg.width / 2;
      }

      pointGroup.collide(mario, calcScore);//When Mario touches any fruits call calcScore Function

      sanitizerGroup.collide(mario, calcSanitizer);//When Mario touches Sanitizer call calcSanitizer Function

      obstacleGroup.collide(mario, decImmunity);//When Mario touches any obstacle call decImmunity Function

      if (sanitizerCount == 0) {

        gameState = 'END';
        die.play();
        changeForEnd();

      }

      sanitizerCount = sanitizerCount - 1;
      
      mario.collide(ground);
      spawnObstacles();
      spawnPoints();
      spawnSanitizer();


    }


   

    if(gameState==='END'){
      //To show as if Mario is going upwards
    if(mario.x===hosp.x){
      mario.pointTo(0,hosp.y);
      mario.velocityY=-2;
      mario.velocityX=0;
    }
      //When Mario touches the hospital
      if(mario.y<320){
        mario.destroy();
        bg.velocityX=0;
        obstacleGroup.setVelocityXEach(0);
        obstacleGroup.setLifetimeEach(-1);
        pointGroup.setVelocityXEach(0);
        pointGroup.setLifetimeEach(-1);
        sanitizerGroup.setVelocityXEach(0);
        sanitizerGroup.setLifetimeEach(-1);
        res.visible = true;
      }
      
     if (mousePressedOver(res)) {
        
        reset();
      }
    }
   
      
      
    //Calling drawSprites only when game is in PLAY and End State so as to avoid getting window below canvas
    if(gameState!='LOAD'&& gameState!='START'){
        drawSprites();
  
  
  
    stroke('white');
    fill('black');
    textSize(20);
    text('Score:' + score, 400, 30);

    stroke('white');
    fill('black');
    textSize(20);
    text('Sanitizer Score:' + sanitizerCount, 10, 30);

    

    if (sanitizerCount < 500&&gameState==='PLAY') {
      fill('Red')
      textSize(50);
      text('Refill Sanitizer!', 300, 200);
    }


    }
  
}

function calcScore(points, mario) {

  points.remove();
  score = score + 10;
}

function calcSanitizer(sanitizer, mario) {

  sanitizer.remove();
  sanitizerCount = sanitizerCount + 500;
}
//Reducing size of Mario everytime it collides with obstacle
function decImmunity(obstacle, mario) {
  s = s - 0.3;
  mario.scale = s;
  
  immunityScore = immunityScore - 1;
  if (immunityScore > 0) {
    immunityGroup.get(immunityScore).remove();

  } else {
    gameState='END';         
    changeForEnd();
    
  }

  obstacle.remove();

}

//Position Mario,destroy all obstacles,fruits and sanitizer.
//Make ground and backgrund velocity 0
//Making hospital Visible
function changeForEnd(){
    
    mario.x=50;
    mario.y=350;
    obstacleGroup.destroyEach();
    pointGroup.destroyEach();
    sanitizerGroup.destroyEach();
    ground.velocityX = 0;
    bg.velocityX = 0;
    mario.velocityX=4;
    hosp.visible=true;
}

function spawnObstacles() {

  if (frameCount % 350 === 0) {
  

    obstacle = createSprite(800, 320, 20, 20);
    var choice=Math.round(random(1,3));
    switch(choice){
      case 1:obstacle.addImage(obs1);
      break;
      case 2:obstacle.addImage(obs2);
      break;
      case 3:obstacle.addImage(obs3);
      break;
      default:
      break;
    }
    obstacle.scale=0.03;
    obstacle.velocityX = -6;
    obstacle.lifetime = 400;
    obstacleGroup.add(obstacle);


  }


}

function spawnPoints() {
  if (frameCount % 100 === 0) {
    points = createSprite(800, random(200,250 ), 10, 10);
    var choice=Math.round(random(1,3));
    switch(choice){
      case 1:points.addImage(point1);
      break;
      case 2:points.addImage(point2);
      break;
      case 3:points.addImage(point3);
      break;
      default:
      break;
    }
    points.scale=0.04;
    points.velocityX = -4;
    points.depth = mario.depth;
    mario.depth = mario.depth + 1;
    points.lifetime = 400;
    pointGroup.add(points);
  }
}

function reset() {

  gameState = "PLAY";
  obstacleGroup.destroyEach();
  pointGroup.destroyEach();
  sanitizerGroup.destroyEach();
  immunityGroup.destroyEach();
  mario=createSprite(50,300);
  mario.addAnimation('alive',marioAlive);
  mario.scale = 1.6;
  s = 1.6;
  score = 0;
  sanitizerCount = 1000;
  res.visible = false;
  mario.changeAnimation('alive', marioAlive);
  immunityScore = 3;
  hosp.visible=false;
  mario.visible=true;
  createImmunity();

}

function spawnSanitizer() {

  if (frameCount % 500  == 0 && frameCount != 0) {
    sanitizer = createSprite(800, random(270, 300))
    sanitizer.scale = 0.05;
    sanitizer.addImage(sanitizerImage);
    sanitizer.velocityX = -4;
    sanitizer.lifetime = 400;
    sanitizerGroup.add(sanitizer);

  }

}

function createImmunity() {

  for (var i = 0; i <= 2; i++) {
    immunity = createSprite(700 + (i * 30), 30, 10, 10);
    if (i == 0) {
      immunity.addImage(shocked);
    } else if (i == 1) {
      immunity.addImage(sad);
    } else {
      immunity.addImage(happy);

    }
    immunity.scale = 0.1;
    immunityGroup.add(immunity);
  }

}
function disappear(){
  mario.visible=false;
}
function changeState() {
  gameState = "PLAY";
  video1.remove();
}
