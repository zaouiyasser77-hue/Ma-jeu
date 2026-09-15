// ==========================================
// 🎮 القائمة الرئيسية
// ==========================================

const mainMenu = document.getElementById("mainMenu");
const shopScreen = document.getElementById("shopScreen");
const settingsScreen = document.getElementById("settingsScreen");
const gameScreen = document.getElementById("gameScreen");

const startButton = document.getElementById("startButton");
const shopButton = document.getElementById("shopButton");
const settingsButton = document.getElementById("settingsButton");
const backButtons = document.querySelectorAll(".backButton");

let gameStarted = false;


// ==========================================
// 🎵 الموسيقى
// ==========================================

const music = new Audio("music.mp3");

music.loop = true;
music.volume = 0.5;

let musicEnabled =
    localStorage.getItem("musicEnabled") !== "false";


function startMusic() {
    if (musicEnabled && music.paused) {
        music.play().catch(function(error) {
            console.log("الموسيقى لم تبدأ:", error);
        });
    }
}


document.addEventListener(
    "pointerdown",
    startMusic,
    { once: true }
);

document.addEventListener(
    "keydown",
    startMusic,
    { once: true }
);


// ==========================================
// ⚙️ زر الموسيقى
// ==========================================

const musicButton = document.createElement("button");

musicButton.id = "musicToggle";

musicButton.style.marginTop = "15px";
musicButton.style.padding = "14px 30px";
musicButton.style.fontSize = "20px";
musicButton.style.border = "none";
musicButton.style.borderRadius = "12px";
musicButton.style.background = "#374151";
musicButton.style.color = "white";
musicButton.style.cursor = "pointer";

settingsScreen.appendChild(musicButton);


function updateMusicButton() {

    if (musicEnabled) {
        musicButton.textContent =
            "🎵 الموسيقى: تشغيل 🔊";
    } else {
        musicButton.textContent =
            "🎵 الموسيقى: إيقاف 🔇";
    }

}

updateMusicButton();


musicButton.addEventListener("click", function(event) {

    event.stopPropagation();

    musicEnabled = !musicEnabled;

    localStorage.setItem(
        "musicEnabled",
        musicEnabled
    );

    updateMusicButton();

    if (musicEnabled) {
        startMusic();
    } else {
        music.pause();
    }

});


// ==========================================
// 🎮 إعداد اللعبة
// ==========================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");
const distanceText = document.getElementById("distance");
const highScoreText = document.getElementById("highScore");


// ==========================================
// 🪙 صورة العملة الجديدة
// ==========================================

const coinImage = new Image();

coinImage.src = "coin.png";


// ==========================================
// 👢 الدوس على الأعداء مثل ماريو
// ==========================================

let stompEnabled =
    localStorage.getItem("stompEnabled") !== "false";


const stompButton = document.createElement("button");

stompButton.id = "stompToggle";

stompButton.style.marginTop = "15px";
stompButton.style.padding = "14px 30px";
stompButton.style.fontSize = "20px";
stompButton.style.border = "none";
stompButton.style.borderRadius = "12px";
stompButton.style.background = "#374151";
stompButton.style.color = "white";
stompButton.style.cursor = "pointer";
stompButton.style.display = "block";
stompButton.style.marginLeft = "auto";
stompButton.style.marginRight = "auto";

settingsScreen.appendChild(stompButton);


function updateStompButton() {

    if (stompEnabled) {

        stompButton.textContent =
            "👢 قتل الأعداء بالقفز: تشغيل ✅";

    } else {

        stompButton.textContent =
            "👢 قتل الأعداء بالقفز: إيقاف ❌";

    }

}

updateStompButton();


stompButton.addEventListener("click", function(event) {

    event.stopPropagation();

    stompEnabled = !stompEnabled;

    localStorage.setItem(
        "stompEnabled",
        stompEnabled
    );

    updateStompButton();

});


// ==========================================
// 🪙 العملات
// ==========================================

// العملات محفوظة حتى بعد إغلاق اللعبة

let score =
    Number(localStorage.getItem("playerCoins")) || 0;

coinsText.textContent = score;


// ==========================================
// 🛒 السكنات
// ==========================================

const SKIN_PRICE = 100;


// السكن المختار

let selectedSkin =
    localStorage.getItem("selectedSkin") ||
    "character.jpg";


// السكنات التي تم شراؤها

let ownedSkins;

try {

    ownedSkins =
        JSON.parse(
            localStorage.getItem("ownedSkins")
        ) || ["character.jpg"];

} catch (error) {

    ownedSkins = ["character.jpg"];

}


// السكن الأصلي مجاني دائمًا

if (!ownedSkins.includes("character.jpg")) {

    ownedSkins.unshift("character.jpg");

}


// جميع السكنات

const skins = [

    {
        file: "character.jpg",
        name: "الفارس الأصلي",
        price: 0
    },

    {
        file: "skin1.png",
        name: "السكن 1",
        price: SKIN_PRICE
    },

    {
        file: "skin2.png",
        name: "Rigby",
        price: SKIN_PRICE
    },

    {
        file: "skin3.png",
        name: "سكن GTA",
        price: SKIN_PRICE
    }

];


// ==========================================
// 🧍 الشخصية
// ==========================================

const character = new Image();

character.src = selectedSkin;


// ==========================================
// 💾 حفظ بيانات السكن والعملات
// ==========================================

function saveSkinData() {

    localStorage.setItem(
        "playerCoins",
        score
    );

    localStorage.setItem(
        "ownedSkins",
        JSON.stringify(ownedSkins)
    );

    localStorage.setItem(
        "selectedSkin",
        selectedSkin
    );

}


// ==========================================
// 🎨 اختيار سكن
// ==========================================

function selectSkin(file) {

    if (!ownedSkins.includes(file)) {
        return;
    }

    selectedSkin = file;

    character.src = selectedSkin;

    saveSkinData();

    updateShop();

}


// ==========================================
// 🛒 شراء سكن
// ==========================================

function buySkin(file) {

    const skin =
        skins.find(function(item) {
            return item.file === file;
        });


    if (!skin) {
        return;
    }


    // السكن المجاني

    if (skin.price === 0) {

        selectSkin(file);

        return;
    }


    // إذا كان مملوكًا

    if (ownedSkins.includes(file)) {

        selectSkin(file);

        return;
    }


    // لا توجد عملات كافية

    if (score < skin.price) {

        alert(
            "❌ تحتاج إلى 100 عملة لشراء هذا السكن!"
        );

        return;
    }


    // خصم السعر

    score -= skin.price;


    // إضافة السكن

    ownedSkins.push(file);


    // اختياره مباشرة

    selectedSkin = file;

    character.src = selectedSkin;


    // تحديث العداد

    coinsText.textContent = score;


    // حفظ

    saveSkinData();


    // تحديث المتجر

    updateShop();

}


// ==========================================
// 🛒 تحديث المتجر
// ==========================================

function updateShop() {

    // إخفاء النص القديم

    const oldTitle =
        shopScreen.querySelector("h2");

    if (oldTitle) {
        oldTitle.style.display = "none";
    }


    // رصيد العملات

    let shopBalance =
        document.getElementById("shopBalance");


    if (!shopBalance) {

        shopBalance =
            document.createElement("h2");

        shopBalance.id = "shopBalance";

        shopScreen.insertBefore(
            shopBalance,
            shopScreen.querySelector(".backButton")
        );

    }


    shopBalance.textContent =
        "🪙 رصيدك: " + score + " عملة";


    // شبكة السكنات

    let shopGrid =
        document.getElementById("shopGrid");


    if (!shopGrid) {

        shopGrid =
            document.createElement("div");

        shopGrid.id = "shopGrid";

        shopGrid.style.display = "flex";
        shopGrid.style.flexWrap = "wrap";
        shopGrid.style.justifyContent = "center";
        shopGrid.style.gap = "20px";
        shopGrid.style.margin = "20px";


        shopScreen.insertBefore(
            shopGrid,
            shopScreen.querySelector(".backButton")
        );

    }


    shopGrid.innerHTML = "";


    // إنشاء بطاقات السكنات

    skins.forEach(function(skin) {

        const card =
            document.createElement("div");

        card.className = "skinCard";

        card.style.background = "#1f2937";
        card.style.padding = "15px";
        card.style.borderRadius = "15px";
        card.style.width = "180px";
        card.style.textAlign = "center";


        // صورة السكن

        const image =
            document.createElement("img");

        image.src = skin.file;

        image.alt = skin.name;

        image.style.width = "120px";
        image.style.height = "150px";
        image.style.objectFit = "contain";


        // اسم السكن

        const name =
            document.createElement("h3");

        name.textContent =
            skin.name;


        // السعر

        const price =
            document.createElement("p");


        if (skin.price === 0) {

            price.textContent =
                "مجاني 🆓";

        } else {

            price.textContent =
                skin.price + " 🪙";

        }


        // الزر

        const button =
            document.createElement("button");

        button.className =
            "skinButton";

        button.style.padding = "10px";
        button.style.border = "none";
        button.style.borderRadius = "10px";
        button.style.cursor = "pointer";


        // السكن الحالي

        if (selectedSkin === skin.file) {

            button.textContent =
                "✅ مستخدم حاليًا";

            button.disabled = true;

        }


        // سكن مملوك

        else if (
            ownedSkins.includes(skin.file)
        ) {

            button.textContent =
                "🎮 اختيار";


            button.addEventListener(
                "click",
                function() {

                    selectSkin(
                        skin.file
                    );

                }
            );

        }


        // سكن غير مملوك

        else {

            button.textContent =
                "🛒 شراء بـ 100 🪙";


            if (score < 100) {
                button.disabled = true;
            }


            button.addEventListener(
                "click",
                function() {

                    buySkin(
                        skin.file
                    );

                }
            );

        }


        card.appendChild(image);

        card.appendChild(name);

        card.appendChild(price);

        card.appendChild(button);

        shopGrid.appendChild(card);

    });

}

const backToMenuGame = document.getElementById("backToMenuGame");

backToMenuGame.addEventListener("click", function() {
    gameScreen.style.display = "none";
    mainMenu.style.display = "flex";
    gameStarted = false;
});

// ==========================================
// ▶️ ابدأ المغامرة
// ==========================================

startButton.addEventListener(
    "click",
    function() {

        mainMenu.style.display = "none";

        shopScreen.style.display = "none";

        settingsScreen.style.display = "none";

        gameScreen.style.display = "block";

        gameStarted = true;

        startMusic();

    }
);


// ==========================================
// 🛒 فتح المتجر
// ==========================================

shopButton.addEventListener(
    "click",
    function() {

        mainMenu.style.display = "none";

        settingsScreen.style.display = "none";

        gameScreen.style.display = "none";

        shopScreen.style.display = "flex";

        updateShop();

        startMusic();

    }
);


// ==========================================
// ⚙️ فتح الإعدادات
// ==========================================

settingsButton.addEventListener(
    "click",
    function() {

        mainMenu.style.display = "none";

        shopScreen.style.display = "none";

        gameScreen.style.display = "none";

        settingsScreen.style.display = "flex";

        startMusic();

    }
);


// ==========================================
// 🔙 الرجوع للقائمة
// ==========================================

backButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                shopScreen.style.display = "none";

                settingsScreen.style.display = "none";

                gameScreen.style.display = "none";

                mainMenu.style.display = "flex";

                gameStarted = false;

                startMusic();

            }
        );

    }
);


// ==========================================
// 🌄 الخلفية
// ==========================================

const background = new Image();

background.src =
    "background.jpg";


// ==========================================
// 🏆 الرقم القياسي
// ==========================================

let highScore =
    Number(
        localStorage.getItem(
            "platformHighScore"
        )
    ) || 0;

highScoreText.textContent =
    highScore;


// ==========================================
// ❤️ الحياة
// ==========================================

let lives = 3;

let gameOver = false;

livesText.textContent =
    lives;


// ==========================================
// 🧍 اللاعب
// ==========================================

const player = {

    x: 100,

    y: 350,

    width: 55,

    height: 75,

    speed: 5,

    vx: 0,

    vy: 0,

    jumpPower: -13,

    gravity: 0.6,

    onGround: false

};


// ==========================================
// 🌍 الخريطة
// ==========================================

let cameraX = 0;

let platforms = [];

let coins = [];

let enemies = [];

let generatedUntil = 950;


// ==========================================
// ⌨️ الكيبورد
// ==========================================

const keys = {};


document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key] = true;


        if (
            event.key === " " ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            jump();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key] = false;

    }
);


// ==========================================
// 🦘 القفز
// ==========================================

function jump() {

    if (
        player.onGround &&
        !gameOver &&
        gameStarted
    ) {

        player.vy =
            player.jumpPower;

        player.onGround =
            false;

    }

}


// ==========================================
// 📱 أزرار الهاتف
// ==========================================

const leftButton =
    document.getElementById("left");

const rightButton =
    document.getElementById("right");

const jumpButton =
    document.getElementById("jump");


leftButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        keys["ArrowLeft"] = true;

    }
);


leftButton.addEventListener(
    "pointerup",
    function(event) {

        event.preventDefault();

        keys["ArrowLeft"] = false;

    }
);


leftButton.addEventListener(
    "pointerleave",
    function() {

        keys["ArrowLeft"] = false;

    }
);


rightButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        keys["ArrowRight"] = true;

    }
);


rightButton.addEventListener(
    "pointerup",
    function(event) {

        event.preventDefault();

        keys["ArrowRight"] = false;

    }
);


rightButton.addEventListener(
    "pointerleave",
    function() {

        keys["ArrowRight"] = false;

    }
);


jumpButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        jump();

    }
);


// ==========================================
// 🗺️ إنشاء الخريطة اللانهائية
// ==========================================

function generateMap() {

    while (
        generatedUntil <
        player.x + 1600
    ) {

        const x =
            generatedUntil +
            50 +
            Math.random() * 100;

        const width =
            120 +
            Math.random() * 170;

        const y =
            280 +
            Math.random() * 130;


        // المنصة

        platforms.push({

            x: x,

            y: y,

            width: width,

            height: 20

        });


        // 🪙 العملة

        if (
            Math.random() > 0.15
        ) {

            coins.push({

                x:
                    x +
                    width / 2,

                y:
                    y - 35,

                collected: false

            });

        }


        // 👾 العدو

        if (
            Math.random() > 0.45
        ) {

            enemies.push({

                x:
                    x +
                    width / 2,

                y:
                    y - 35,

                width: 35,

                height: 35,

                speed:
                    Math.random() > 0.5
                        ? 1.5
                        : -1.5,

                min: x,

                max:
                    x + width

            });

        }


        generatedUntil =
            x + width;

    }

}


// ==========================================
// 🏠 المنصات الأولى
// ==========================================

platforms.push({

    x: -500,

    y: 455,

    width: 1500,

    height: 45

});


platforms.push({

    x: 150,

    y: 370,

    width: 150,

    height: 20

});


platforms.push({

    x: 370,

    y: 310,

    width: 150,

    height: 20

});


platforms.push({

    x: 600,

    y: 370,

    width: 150,

    height: 20

});


platforms.push({

    x: 800,

    y: 290,

    width: 150,

    height: 20

});


generateMap();

// ==========================================
// 💥 التصادم
// ==========================================

function collision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


// ==========================================
// 🔄 إعادة اللاعب
// ==========================================

function resetPlayer() {

    player.x =
        Math.max(
            100,
            player.x - 250
        );

    player.y = 200;

    player.vx = 0;

    player.vy = 0;

}


// ==========================================
// 🔄 تحديث اللعبة
// ==========================================

function update() {

    if (
        !gameStarted ||
        gameOver
    ) {
        return;
    }


    generateMap();


    // ======================================
    // الحركة
    // ======================================

    player.vx = 0;


    if (keys["ArrowLeft"]) {

        player.vx =
            -player.speed;

    }


    if (keys["ArrowRight"]) {

        player.vx =
            player.speed;

    }


    player.x +=
        player.vx;


    if (
        player.x <
        cameraX + 50
    ) {

        player.x =
            cameraX + 50;

    }


    // ======================================
    // الجاذبية
    // ======================================

    const oldBottom =
        player.y +
        player.height;


    player.vy +=
        player.gravity;


    player.y +=
        player.vy;


    player.onGround =
        false;


    // ======================================
    // المنصات
    // ======================================

    for (
        const platform of platforms
    ) {

        const newBottom =
            player.y +
            player.height;


        if (
            player.x +
                player.width >
                platform.x &&

            player.x <
                platform.x +
                platform.width &&

            oldBottom <=
                platform.y &&

            newBottom >=
                platform.y &&

            player.vy >= 0
        ) {

            player.y =
                platform.y -
                player.height;

            player.vy = 0;

            player.onGround =
                true;

        }

    }


    // ======================================
    // 🪙 العملات
    // ======================================

    for (
        const coin of coins
    ) {

        if (
            !coin.collected
        ) {

            const dx =
                player.x +
                player.width / 2 -
                coin.x;


            const dy =
                player.y +
                player.height / 2 -
                coin.y;


            if (
                Math.abs(dx) < 35 &&
                Math.abs(dy) < 45
            ) {

                coin.collected =
                    true;


                score++;


                coinsText.textContent =
                    score;


                localStorage.setItem(
                    "playerCoins",
                    score
                );

            }

        }

    }


    // ======================================
    // 👾 الأعداء
    // ======================================

    for (
        const enemy of enemies
    ) {

        if (enemy.dead) {
            continue;
        }


        enemy.x +=
            enemy.speed;


        if (
            enemy.x <= enemy.min ||
            enemy.x +
                enemy.width >=
                enemy.max
        ) {

            enemy.speed *=
                -1;

        }


        // ==================================
        // 👢 قتل العدو بالقفز
        // ==================================

        if (
            stompEnabled &&
            collision(player, enemy) &&
            player.vy > 0 &&
            player.y +
                player.height -
                enemy.y < 25
        ) {

            enemy.dead = true;


            // ارتداد اللاعب بعد الدوس

            player.vy =
                player.jumpPower * 0.65;


            // مكافأة

            score++;


            coinsText.textContent =
                score;


            localStorage.setItem(
                "playerCoins",
                score
            );


            continue;

        }


        // ==================================
        // 💥 اصطدام عادي بالعدو
        // ==================================

        if (
            collision(player, enemy)
        ) {

            lives--;


            livesText.textContent =
                lives;


            resetPlayer();


            if (
                lives <= 0
            ) {

                gameOver =
                    true;

            }

        }

    }


    // ======================================
    // تنظيف الأعداء الميتين
    // ======================================

    enemies =
        enemies.filter(
            function(enemy) {

                return !enemy.dead;

            }
        );


    // ======================================
    // السقوط
    // ======================================

    if (
        player.y > 600
    ) {

        lives--;


        livesText.textContent =
            lives;


        resetPlayer();


        if (
            lives <= 0
        ) {

            gameOver =
                true;

        }

    }


    // ======================================
    // 📷 الكاميرا
    // ======================================

    cameraX =
        player.x - 250;


    if (
        cameraX < 0
    ) {

        cameraX = 0;

    }


    // ======================================
    // 📏 المسافة
    // ======================================

    const distance =
        Math.max(
            0,
            Math.floor(
                (player.x - 100) / 10
            )
        );


    distanceText.textContent =
        distance;


    // ======================================
    // 🏆 الرقم القياسي
    // ======================================

    if (
        distance > highScore
    ) {

        highScore =
            distance;


        highScoreText.textContent =
            highScore;


        localStorage.setItem(
            "platformHighScore",
            highScore
        );

    }


    // ======================================
    // 🧹 تنظيف الأشياء القديمة
    // ======================================

    platforms =
        platforms.filter(
            function(platform) {

                return (
                    platform.x >
                    cameraX - 1000
                );

            }
        );


    coins =
        coins.filter(
            function(coin) {

                return (
                    coin.x >
                    cameraX - 1000
                );

            }
        );


    enemies =
        enemies.filter(
            function(enemy) {

                return (
                    enemy.x >
                    cameraX - 1000
                );

            }
        );

}


// ==========================================
// 🌄 رسم الخلفية
// ==========================================

function drawBackground() {

    if (
        background.complete &&
        background.naturalWidth > 0
    ) {

        ctx.drawImage(
            background,
            0,
            0,
            canvas.width,
            canvas.height
        );

    } else {

        ctx.fillStyle =
            "#87CEEB";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

}


// ==========================================
// 🎨 رسم اللعبة
// ==========================================

function draw() {

    drawBackground();


    // ======================================
    // المنصات
    // ======================================

    for (
        const platform of platforms
    ) {

        const screenX =
            platform.x -
            cameraX;


        ctx.fillStyle =
            "#704214";


        ctx.fillRect(
            screenX,
            platform.y,
            platform.width,
            platform.height
        );


        ctx.fillStyle =
            "#35A853";


        ctx.fillRect(
            screenX,
            platform.y,
            platform.width,
            7
        );

    }


    // ======================================
    // 🪙 العملات الجديدة
    // ======================================

    for (
        const coin of coins
    ) {

        if (
            !coin.collected
        ) {

            const screenX =
                coin.x -
                cameraX;


            if (
                coinImage.complete &&
                coinImage.naturalWidth > 0
            ) {

                ctx.drawImage(
                    coinImage,
                    screenX - 18,
                    coin.y - 18,
                    36,
                    36
                );

            } else {

                // احتياط إذا لم توجد الصورة

                ctx.fillStyle =
                    "#FFD700";


                ctx.beginPath();


                ctx.arc(
                    screenX,
                    coin.y,
                    12,
                    0,
                    Math.PI * 2
                );


                ctx.fill();

            }

        }

    }


    // ======================================
    // 👾 الأعداء
    // ======================================

    for (
        const enemy of enemies
    ) {

        if (enemy.dead) {
            continue;
        }


        const screenX =
            enemy.x -
            cameraX;


        ctx.fillStyle =
            "#7C3AED";


        ctx.fillRect(
            screenX,
            enemy.y,
            enemy.width,
            enemy.height
        );


        ctx.fillStyle =
            "white";


        ctx.fillRect(
            screenX + 6,
            enemy.y + 7,
            7,
            7
        );


        ctx.fillRect(
            screenX + 22,
            enemy.y + 7,
            7,
            7
        );

    }


    // ======================================
    // 🧍 اللاعب
    // ======================================

    const playerScreenX =
        player.x -
        cameraX;


    if (
        character.complete &&
        character.naturalWidth > 0
    ) {

        ctx.drawImage(
            character,
            playerScreenX,
            player.y,
            player.width,
            player.height
        );

    }


    // ======================================
    // 💀 نهاية اللعبة
    // ======================================

    if (
        gameOver
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "white";


        ctx.textAlign =
            "center";


        ctx.font =
            "bold 45px Arial";


        ctx.fillText(
            "💀 انتهت اللعبة",
            canvas.width / 2,
            220
        );


        ctx.font =
            "24px Arial";


        ctx.fillText(
            "اضغط F5 للعب من جديد",
            canvas.width / 2,
            270
        );

    }

}


// ==========================================
// 🔁 حلقة اللعبة
// ==========================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();