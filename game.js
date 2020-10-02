
let config ={
    type:Phaser.AUTO,
    scale:{
        mode:Phaser.Scale.FIT,
        width: 1000,
        height:600,
    },
    
    backgroundColor:0xffcc00,
    
    
    physics:{
        
        
        default:'arcade',
        arcade:{
            
            gravity:{
                y:1000,
            },
            debug:false,
        }
    },
    
    scene:{
        
        preload:preload,
        create:create,
        update:update,
    
}
    
    
};

let game =new Phaser.Game(config);

//players configration

let player_config= {
    player_speed:150,
    player_jumpspeed:-700,
}




function preload()
{
    this.load.image("ground","assets05/topground.png");
    this.load.image("sky","assets05/background.png");
     this.load.image("apple","assets05/apple.png");
    this.load.spritesheet("dude","assets05/dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("ray","assets05/ray.png");
}

function create()
{
  W=game.config.width;
  H=game.config.height;
    
    //add tilesprites
    let ground = this.add.tileSprite(0,H-128,W,128,"ground");
    ground.setOrigin(0,0);
    //try to create a background
    
    let background = this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth = W;
    background.displayHeight =H;
    background.depth=-2;
    
    this.score=0;
    this.scoreText=null;
    
    
    //create ray on the top of the background
    let rays=[];
    for(let i=-10;i<=10;i++)
        {
      let ray= this.add.sprite(W/2,H-128,'ray');
      ray.setOrigin(0.5,1);
      ray.alpha=0.2;
      ray.angle=i*10;
      ray.displayHeight = 1.5*H;
      ray.depth=-1;
      rays.push(ray);        
            
        }
    
    
    //tween for angle rotation of the rays
    this.tweens.add(
    {
        targets: rays,
        props:{
            angle:
            {
                value :"+=20",
            },
        },
        duration:6000,
        repeat: -1,
    });
    
    
    
     this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
    
    this.player = this.physics.add.sprite(100,100,'dude',4);
    console.log(this.player);
    //set the bounce values
    this.player.setBounce(0.3);
    this.player.setCollideWorldBounds(true);
    //player animation and player movement
    
    this.anims.create(
{
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
    frameRate: 10,
    repeat: -1,
});
     this.anims.create(
{
    key: 'center',
    frames: [{key:'dude',frame:4}],
    frameRate: 10,
    
});
     this.anims.create(
{
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
    frameRate: 10,
    repeat: -1,
});
    
    
    
    
    //keyboard
    this.cursor = this.input.keyboard.createCursorKeys();
    
    
    
    
    //add a group of apples:movable objects
    
    let fruit = this.physics.add.group({
        key:"apple",
        repeat: 8,
        setScale:{x:0.2,y:0.2},
        setXY : { x:10,y:0,stepX:100},
    });
    
    
    //add bouncing effect to all apples
    fruit.children.iterate(function(f)
                          {
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
    });
    
    //create more platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(500,300,'ground').setScale(2,0.5).refreshBody();
     platforms.create(700,100,'ground').setScale(2,0.5).refreshBody();
     platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
    //we can add this line instead of line :99--platforms.add(ground);
    
    
    this.physics.add.existing(ground,true);
   // ground.body.allowGravity = false;
    //ground.body.immovable = true;
    
    //add a collision detection between player and ground
    this.physics.add.collider(ground,this.player);
    this.physics.add.collider(ground,fruit);
    this.physics.add.collider(platforms,fruit);
    this.physics.add.collider(platforms,this.player);
    this.physics.add.collider(this.player,fruit,eatFruit,null,this);
    
    
    
    //create camera
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.3);
    
    
    
    //added new
           var button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

        button.on('pointerup', function () {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);

                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);

                this.scale.startFullscreen();
            }

        }, this);

     this.scoreText.setText('v15');

        var FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);
                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);
    }
    
//end of added new
    
    
    


function update()
{
    if(this.cursor.left.isDown)
        {
            this.player.setVelocityX(-player_config.player_speed);
            this.player.anims.play('left',true);
        }
     
    else if(this.cursor.right.isDown)
        {
            this.player.setVelocityX(player_config.player_speed);
            this.player.anims.play('right',true);
        }
    else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('center');
        }
    
    //add jumping ablity
    if(this.cursor.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(player_config.player_jumpspeed);
        }
       
    
}

function eatFruit(player,fruit)
{
    fruit.disableBody(true,true);
    this.score += 10;
    this.scoreText.setText('Score::'+this.score);
}