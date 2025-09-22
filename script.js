document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded event fired.");

    // --- 要素の取得 ---
    const selectionScreen = document.getElementById('selectionScreen');
    const fortuneDetailSections = document.querySelectorAll('.fortune-detail-section');
    const iconItems = document.querySelectorAll('.icon-item');
    const backButtons = document.querySelectorAll('.back-to-selection');

    // --- 新規追加: テンキー関連要素の取得 ---
    const numpadKeys = document.querySelectorAll('.numpad-key');

    // ラッキーナンバー占い
    const luckyNumberInput = document.getElementById('luckyNumber');
    const drawButton = document.getElementById('drawButton');
    const messageElement = document.getElementById('message');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultModal = document.getElementById('resultModal');
    const mainFortuneHeading = document.getElementById('mainFortuneHeading');
    const fortuneDetails = document.getElementById('fortuneDetails');
    const closeResultButton = document.getElementById('closeResultButton');
    const shareFortuneButton = document.getElementById('shareFortuneButton');
    const confettiContainer = document.querySelector('.confetti-container');

    console.log("script.js: resultOverlay initial classes:", resultOverlay.classList);
    console.log("script.js: resultOverlay initial display style:", window.getComputedStyle(resultOverlay).display);

    // 漢字一文字占い
    const drawCharacterButton = document.getElementById('drawCharacterButton');
    const characterMessageElement = document.getElementById('characterMessage');
    const characterResultDiv = document.getElementById('characterResult');
    const drawnCharacterElement = document.getElementById('drawnCharacter');
    const characterDescriptionElement = document.getElementById('characterDescription');

    // 札引き占い
    const cardDrawMessageElement = document.getElementById('cardDrawMessage');
    const cardGrid = document.getElementById('cardGrid');
    const cardResultDiv = document.getElementById('cardResult');
    const drawnCardFortuneElement = document.getElementById('drawnCardFortune');
    const resetCardsButton = document.getElementById('resetCardsButton');

    // --- 定数・データ ---
    const possibleResults = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];
    // 運勢のカテゴリ（表示順）
    const fortuneCategories = ["総運", "仕事運", "恋愛運", "学業"];

    // 各運勢タイプとカテゴリごとの説明文（重複を避けるためにバリエーションを増やす）
    const descriptions = {
        "大吉": {
            "総運": [
                "最高の一日！素晴らしい成果が期待できます。積極的に行動しましょう。",
                "運気は絶好調。すべての努力が報われるでしょう。自信を持って前進を。",
                "あらゆる面で恵まれた一日。思いがけない幸運が舞い込む予感。",
                "あなたの魅力が最大限に発揮される時。周囲を巻き込み成功を掴みましょう。"
            ],
            "仕事運": [
                "大きな成功が待っています。努力が報われる時です。重要なプロジェクトは今日に集中。",
                "キャリアアップのチャンス到来。リーダーシップを発揮し、周囲を導きましょう。",
                "新しいアイデアが次々と生まれ、周囲から高い評価を得るでしょう。",
                "目標達成に向けた追い風が吹いています。迷わず突き進みましょう。"
            ],
            "恋愛運": [
                "最高の出会いがあるかも。素直な気持ちで接しましょう。関係進展の大きなチャンス。",
                "理想の相手との縁が深まる日。積極的にアプローチすると良いでしょう。",
                "パートナーとの絆が深まる、心温まる一日。感謝の気持ちを伝えて。",
                "魅力が輝き、多くの人を惹きつけます。出会いの場には積極的に参加を。"
            ],
            "学業": [
                "学業が大いに進展する時。難しい問題にも挑戦を！集中力も高まっています。",
                "努力が実を結び、素晴らしい結果を得られるでしょう。復習も完璧に。",
                "新しい知識やスキルがスムーズに習得できる日。資格取得にも良いタイミング。",
                "理解力が高まり、苦手分野も克服できるでしょう。自信を持って学び続けましょう。"
            ]
        },
        "中吉": {
            "総運": [
                "良い一日です。まずまず順調に進むでしょう。焦らず着実に。",
                "安定した運気で、穏やかな一日を過ごせそう。計画通りに進めましょう。",
                "小さな幸運が重なり、気分よく過ごせるでしょう。感謝の気持ちを忘れずに。",
                "全体的にバランスの取れた日。新しいことより現状維持に努めると吉。"
            ],
            "仕事運": [
                "仕事運は安定。計画通りに進めば良い結果が出ます。着実にタスクをこなしましょう。",
                "地道な努力が評価される時。細部にこだわり、丁寧な仕事を心がけて。",
                "周囲との協調性が幸運を呼びます。チームワークを大切に。",
                "問題解決能力が高まる日。冷静な判断でスムーズに業務を遂行できるでしょう。"
            ],
            "恋愛運": [
                "良い雰囲気になりそう。小さな親切が縁を深めます。穏やかな愛情を育んで。",
                "パートナーとの関係がより安定する日。共通の趣味を見つけると良いでしょう。",
                "出会いの予感も。自然体でいることが良い縁を引き寄せます。",
                "友人関係から発展する可能性も。誠実な態度が大切です。"
            ],
            "学業": [
                "着実に進歩するでしょう。基礎固めをしっかり行いましょう。焦らず地道な努力を。",
                "苦手分野の克服に良い日。集中して取り組めば理解が深まります。",
                "グループ学習が効果的。友人と教え合うことで知識が定着します。",
                "計画を立てて学習に取り組むと効率アップ。短期目標を設定しましょう。"
            ]
        },
        "小吉": {
            "総運": [
                "平穏な一日でしょう。大きな変化はありませんが、安定した運気です。",
                "静かに過ごすのに適した日。無理せず、自分のペースを守りましょう。",
                "目立たないけれど、確かな実りがある一日。小さな幸せを見つけて。",
                "現状維持に徹すると良いでしょう。焦りは禁物です。"
            ],
            "仕事運": [
                "安定した運気。地道な作業が評価されます。ルーティンワークを丁寧に。",
                "新しい挑戦より、既存のタスクを完璧にこなすことに集中しましょう。",
                "細かいミスに注意が必要。確認作業を怠らないように。",
                "周囲の意見に耳を傾けることで、思わぬヒントが得られるかもしれません。"
            ],
            "恋愛運": [
                "穏やかな時間を過ごせそう。身近な人との交流を大切に。感謝の気持ちを伝えて。",
                "大きな進展は期待薄ですが、安定した関係を築けます。相手を気遣いましょう。",
                "友人との時間を楽しむのが吉。恋愛は焦らず、自然な流れに任せて。",
                "一人の時間を大切にし、自己を見つめ直すことで魅力が増します。"
            ],
            "学業": [
                "基礎を固めるのに良い時です。復習に時間を使いましょう。疑問点はすぐに解決を。",
                "新しい分野より、得意科目の深掘りに時間を費やすと良いでしょう。",
                "静かな環境で集中力を高めましょう。図書館などがおすすめです。",
                "小さな目標を設定し、達成感を積み重ねることがモチベーション維持に繋がります。"
            ]
        },
        "吉": {
            "総運": [
                "まずまずの一日です。少しずつ前進しましょう。小さな幸せを見つけられる日。",
                "運気は緩やかに上昇中。積極的に行動することで、さらに開運に繋がります。",
                "良い変化の兆しが見えます。直感を信じて一歩踏み出してみて。",
                "何事もバランス良く進めると良いでしょう。無理のない範囲で行動を。"
            ],
            "仕事運": [
                "少しずつ運気が上向きます。新しいことにも目を向けましょう。情報収集が吉。",
                "協力者を得られる可能性。困った時は周囲に頼ってみましょう。",
                "新しい仕事のアイデアが浮かぶかも。積極的に提案してみましょう。",
                "努力次第で成果が期待できます。前向きな姿勢を保ちましょう。"
            ],
            "恋愛運": [
                "小さな幸せを見つけられそう。感謝の気持ちを伝えましょう。素直な行動が吉。",
                "新しい出会いも期待できる日。笑顔を忘れずに。",
                "関係を進展させるチャンス。共通の話題で盛り上がれるかも。",
                "相手の気持ちを尊重し、穏やかなコミュニケーションを心がけましょう。"
            ],
            "学業": [
                "地道な努力が大切です。コツコツと取り組めば成果が出ます。予習・復習を怠らず。",
                "興味を持った分野を深く掘り下げてみましょう。新たな発見があるかもしれません。",
                "友人との意見交換が学びを深めます。積極的にディスカッションを。",
                "目標を再確認し、具体的な計画を立てることで、学習意欲が高まります。"
            ]
        },
        "末吉": {
            "総運": [
                "これから良くなる兆し。焦らずゆっくり進みましょう。希望を忘れずに。",
                "今は準備期間。焦らず好機を待ちましょう。 Patience is key.",
                "困難があっても、解決の糸口は見つかるでしょう。諦めない心が大切です。",
                "現状維持に徹し、無理な行動は避けましょう。次へのステップの準備期間です。"
            ],
            "仕事運": [
                "焦らずゆっくり進みましょう。準備期間と捉えましょう。計画の見直しも吉。",
                "今は基盤固めの時。スキルアップや情報収集に時間を使いましょう。",
                "大きな決断は先送りに。現状のタスクを丁寧にこなすことに集中。",
                "周囲の助言に耳を傾けることで、良い方向へ導かれるでしょう。"
            ],
            "恋愛運": [
                "良い方向に進むでしょう。気になる人には積極的に話しかけてみて。小さなアクションが大切。",
                "関係はゆっくりと進展。焦らず、相手のペースを尊重しましょう。",
                "過去の経験から学ぶことで、良い恋愛に繋がるでしょう。",
                "自分磨きに時間を費やすことで、魅力が増し、良い縁を引き寄せます。"
            ],
            "学業": [
                "諦めずに取り組みましょう。粘り強さが開運の鍵です。努力は必ず報われます。",
                "苦手分野に再挑戦する好機。基礎からじっくり取り組むと良いでしょう。",
                "集中力が散漫になりやすい日。短時間集中を心がけ、休憩をこまめに取りましょう。",
                "疑問点は放置せず、すぐに質問して解決しましょう。早めの対応が吉。"
            ]
        },
        "凶": {
            "総運": [
                "試練の一日かもしれません。慎重に行動しましょう。無理は禁物です。冷静な判断を。",
                "注意が必要な日。軽率な行動は避け、リスクを最小限に抑えましょう。",
                "今日は静かに過ごすのが賢明。大きな変化は避けて。",
                "困難に直面する可能性も。冷静に対処し、感情的にならないよう注意。"
            ],
            "仕事運": [
                "注意が必要な時です。大きな決断は避けましょう。現状維持に徹し、慎重に。",
                "トラブル発生の予感。事前にリスクを洗い出し、対策を練りましょう。",
                "コミュニケーション不足が原因で誤解が生じやすい日。確認を怠らないように。",
                "疲労が溜まりやすいので、無理せず休憩を取り、体調管理に努めましょう。"
            ],
            "恋愛運": [
                "誤解が生じやすいかも。言葉に注意を払いましょう。感情的な衝突は避けて。",
                "相手との意見の相違が目立つ日。相手の気持ちを尊重し、歩み寄りが大切。",
                "出会いの場は慎重に選ぶべき。焦って行動しないこと。",
                "自分勝手な行動はトラブルの元。相手の気持ちを深く考える時間を作りましょう。"
            ],
            "学業": [
                "困難に立ち向かう勇気を持ちましょう。基礎に戻るのが吉。焦らず、じっくりと。",
                "集中力が散漫になりやすい日。気分転換を取り入れながら学習しましょう。",
                "テストや発表では思わぬミスがあるかも。最終確認を徹底しましょう。",
                "周囲の意見に耳を傾け、謙虚な姿勢で学ぶことが大切です。"
            ]
        }
    };

    const oneCharacterFortunes = [
        { char: "幸", desc: "最高の幸せが訪れる兆し。笑顔で過ごしましょう。" },
        { char: "福", desc: "幸運が舞い込む予感。感謝の気持ちを忘れずに。" },
        { char: "昇", desc: "運気が上昇中。積極的に行動すると良いでしょう。" },
        { char: "進", desc: "目標に向かって前進する時。諦めずに努力を重ねましょう。" },
        { char: "願", desc: "願いが叶うチャンス。具体的な行動が鍵となります。" },
        { char: "結", desc: "人との繋がりが深まる一日。交流を大切にしましょう。" },
        { char: "光", desc: "明るい未来が待っています。ポジティブ思考で進みましょう。" },
        { char: "豊", desc: "心身ともに満たされる時。豊かな恵みを受け取れます。" },
        { char: "楽", desc: "楽しい一日を過ごせそう。趣味や好きなことに時間を使いましょう。" },
        { char: "動", desc: "新しいことに挑戦する好機。積極的に行動してみましょう。" },
        { char: "挑", desc: "困難に立ち向かう勇気。成長のチャンスです。" },
        { char: "学", desc: "学びの多い一日。新しい知識やスキルを吸収しましょう。" },
        { char: "考", desc: "じっくり考える時間が必要。焦らず判断しましょう。" },
        { char: "信", desc: "自分や他人を信じる心。信頼関係が深まります。" },
        { char: "待", desc: "今は準備期間。焦らず好機を待ちましょう。" },
        { char: "繋", desc: "人との縁が深まる時。コミュニケーションを大切に。" },
        { char: "協", desc: "協力することで道が開けます。チームワークを意識しましょう。" },
        { char: "穏", desc: "平穏な一日。無理せず、心穏やかに過ごしましょう。" },
        { char: "静", desc: "内省する時間。自分と向き合い、心を落ち着かせましょう。" },
        { char: "耐", desc: "試練の時ですが、耐え抜けば成長があります。" },
        { char: "整", desc: "物事を整理する良い機会。環境や心を整えましょう。" },
        { char: "慎", desc: "慎重な行動が吉。よく考えてから行動しましょう。" },
        { char: "城", desc: "堅固な基盤を築く時。歴史に学び、未来を築きましょう。" },
        { char: "北", desc: "新たな方向性が見つかるかも。見慣れない道を探検しましょう。" },
        { char: "郷", desc: "故郷やルーツを大切に。心が安らぐ場所を見つけましょう。" },
        { char: "道", desc: "進むべき道が見える日。一歩踏み出してみましょう。" },
        { char: "花", desc: "才能が開花する兆し。美しさと喜びを見つけましょう。" },
        { char: "風", desc: "変化の風が吹く日。新しい情報に耳を傾けましょう。" },
        { char: "水", desc: "柔軟な思考が鍵。流れに身を任せてみましょう。" },
        { char: "山", desc: "揺るぎない安定。着実に目標に向かいましょう。" }
    ];

    const totalCards = 35; // 5x7 = 35枚
    const cardFortunes = [
        "大吉：今日は全てが順調に進むでしょう！", "中吉：まずまずの一日。堅実に過ごしましょう。",
        "小吉：穏やかな一日です。焦らずゆっくり進みましょう。", "吉：良い兆しがあります。前向きに行動してみましょう。",
        "末吉：これから運気が上がります。希望を持って進みましょう。", "凶：試練の時かもしれません。慎重に行動し、無理は禁物です。",
        "大吉：最高の幸運が訪れる予感！笑顔で過ごしましょう。", "中吉：目標に向かって着実に前進できる日です。",
        "小吉：小さな発見があるかも。周囲に目を向けてみましょう。", "吉：人間関係が良好な一日。コミュニケーションを大切に。",
        "末吉：困難があっても、解決の糸口は見つかるでしょう。", "凶：今日は休息が必要。無理せず体を労りましょう。",
        "大吉：願いが叶う最高のチャンス！自信を持って行動しましょう。", "中吉：新しいアイデアがひらめく予感。メモしておきましょう。",
        "小吉：地道な努力が実を結ぶ日。諦めずに続けましょう。", "吉：金運が少し上昇中。無駄遣いは控えめに.",
        "末吉：迷いが生じやすい日。信頼できる人に相談してみましょう。", "凶：トラブルに注意が必要。冷静に対処しましょう。",
        "大吉：愛と喜びが溢れる一日！大切な人と過ごしましょう。", "中吉：仕事や学業が順調に進むでしょう。",
        "小吉：新しい趣味や興味が見つかるかも。試してみましょう。", "吉：健康運が良い日。軽い運動を取り入れてみましょう。",
        "末吉：気分が沈みがちな日。リフレッシュを心がけましょう。", "凶：対人関係で誤解が生じやすいかも。言葉に注意を払いましょう。",
        "大吉：予期せぬ幸運が舞い込むでしょう！", "中吉：新しい出会いがあるかも。積極的に交流してみましょう。",
        "小吉：集中力が高まる日。勉強や仕事が捗るでしょう。", "吉：創造性が高まる日。新しいことに挑戦してみましょう。",
        "末吉：些細なことにイライラしやすい日。深呼吸を忘れずに。", "凶：損失に注意。今日は大きな決断は避けましょう。",
        "大吉：困難を乗り越え、大きく成長できる一日！", "中吉：計画通りに進むでしょう。準備を怠りなく。",
        "小吉：直感が冴える日。自分の気持ちを信じてみましょう。", "吉：少しだけ冒険してみると良いことがあるかも。",
        "末吉：焦りは禁物。ゆっくりと着実に進みましょう。", "凶：感情的になりやすい日。冷静さを保ちましょう。"
    ];
    
    let currentFortuneType = "";

    // --- ユーティリティ関数 ---
    function generateConfetti() {
        confettiContainer.innerHTML = '';
        const count = 100;
        const colors = ['#fdd835', '#ff9800', '#e64a19', '#ffc107', '#4CAF50', '#2196F3'];
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.setProperty('--random-x', `${(Math.random() - 0.5) * window.innerWidth * 1.5}px`);
            confetti.style.setProperty('--random-y', `${window.innerHeight + Math.random() * 200}px`);
            confettiContainer.appendChild(confetti);
        }
    }

    // 配列から重複なく要素をランダムに取得するヘルパー関数
    function getRandomUniqueElements(arr, count) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function generateLuckyNumbers(count) {
        const numbers = [];
        while (numbers.length < count) {
            const randomNumber = Math.floor(Math.random() * 1000) + 1;
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
            }
        }
        console.log("script.js: Generated lucky numbers:", numbers);
        return numbers.sort((a, b) => a - b);
    }
    // const luckyNumbers = generateLuckyNumbers(50);
    // 手動で設定するラッキーナンバー（1〜1000の範囲内）
　　const luckyNumbers = [
    3, 14, 25, 37, 48, 59, 68, 72, 81, 90,
    101, 123, 145, 168, 190, 212, 234, 256, 278, 300,
    333, 360, 388, 400, 420, 444, 478, 500, 520, 555,
    580, 600, 612, 633, 650, 678, 700, 720, 740, 760,
    777, 800, 820, 840, 860, 880, 900, 920, 950, 999
　　];

    console.log("script.js: Final luckyNumbers array:", luckyNumbers);

    // --- 画面切り替えロジック ---
    function showScreen(screenId) {
        fortuneDetailSections.forEach(section => {
            section.classList.add('hidden');
        });
        selectionScreen.classList.add('hidden');

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        console.log("script.js: Screen changed to:", screenId);
    }

    iconItems.forEach(icon => {
        icon.addEventListener('click', () => {
            const fortuneType = icon.dataset.fortuneType;
            console.log("script.js: Icon clicked for fortune type:", fortuneType);
            if (fortuneType === 'luckyNumber') {
                showScreen('luckyNumberFortune');
            } else if (fortuneType === 'oneCharacter') {
                showScreen('oneCharacterFortune');
            } else if (fortuneType === 'cardDraw') {
                showScreen('cardDrawFortune');
                initializeCards(); 
            }
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("script.js: Back to selection button clicked.");
            fortuneDetailSections.forEach(section => {
                section.classList.add('hidden');
            });
            selectionScreen.classList.remove('hidden');
            messageElement.textContent = "";
            luckyNumberInput.value = "";
            characterMessageElement.textContent = "";
            characterResultDiv.classList.add('hidden');
            cardDrawMessageElement.textContent = "";
            cardResultDiv.classList.add('hidden');
            confettiContainer.innerHTML = '';
            resultOverlay.classList.add('hidden');
            console.log("script.js: resultOverlay hidden class added on back button.");
        });
    });

    // --- 各占いロジック ---

    // ラッキーナンバー占い
    drawButton.addEventListener('click', () => {
        console.log("script.js: Lucky number draw button clicked.");
        const lastDrawTime = localStorage.getItem('lastDrawTime_luckyNumber');
        const currentTime = Date.now();

        messageElement.textContent = "";
        confettiContainer.innerHTML = '';
        shareFortuneButton.classList.add('hidden');
        
        mainFortuneHeading.textContent = "";
        fortuneDetails.innerHTML = "";

        if (lastDrawTime && (currentTime - parseInt(lastDrawTime)) < 180000) {
            messageElement.textContent = "次の占いは3分後に引けます。少し休憩しましょう！";
            console.log("script.js: Cooldown active for lucky number.");
            return;
        }

        const inputNumber = parseInt(luckyNumberInput.value);
        console.log("script.js: Input number value:", luckyNumberInput.value, "Parsed inputNumber:", inputNumber);

        if (isNaN(inputNumber) || inputNumber < 1 || inputNumber > 1000) {
            messageElement.textContent = "1から1000までの数字を入力してください。";
            console.log("script.js: Validation failed: Invalid input number.", inputNumber);
            return;
        }

        if (!luckyNumbers.includes(inputNumber)) {
            messageElement.textContent = "残念！その数字は今日のラッキーナンバーではありませんでした。";
            console.log("script.js: Validation failed: Input number not lucky.", inputNumber);
            return;
        }

        // 運勢の決定
        currentFortuneType = possibleResults[Math.floor(Math.random() * possibleResults.length)];
        console.log("script.js: Generated main fortune type:", currentFortuneType);
        
        mainFortuneHeading.textContent = currentFortuneType;
        possibleResults.forEach(res => mainFortuneHeading.classList.remove(`fortune-${res.toLowerCase()}`));
        mainFortuneHeading.classList.add(`fortune-${currentFortuneType.toLowerCase()}`);

        let detailsHtml = "";
        if (descriptions[currentFortuneType]) {
            // 各カテゴリの説明文を重複なくランダムに選択
            fortuneCategories.forEach(category => {
                const categoryDescriptions = descriptions[currentFortuneType][category];
                if (categoryDescriptions && categoryDescriptions.length > 0) {
                    // カテゴリ内の説明文からランダムに1つ選択
                    const chosenDescription = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
                    detailsHtml += `<p><strong>${category}</strong>: ${chosenDescription}</p>`;
                } else {
                    console.warn(`No descriptions found for ${currentFortuneType} - ${category}`);
                    detailsHtml += `<p><strong>${category}</strong>: 説明がありませんでした。</p>`;
                }
            });
            console.log("script.js: Generated details HTML:", detailsHtml);
        } else {
            console.error("script.js: Error: Fortune type description not found for", currentFortuneType);
            detailsHtml = "<p>運勢の詳細を取得できませんでした。</p>";
        }
        fortuneDetails.innerHTML = detailsHtml;

        resultOverlay.classList.remove('hidden');
        console.log("script.js: resultOverlay 'hidden' class removed.");
        generateConfetti();
        shareFortuneButton.classList.remove('hidden');
        localStorage.setItem('lastDrawTime_luckyNumber', currentTime);
    });

    closeResultButton.addEventListener('click', () => {
        console.log("script.js: Close result button clicked.");
        resultOverlay.classList.add('hidden');
        confettiContainer.innerHTML = '';
        luckyNumberInput.value = "";
        console.log("script.js: resultOverlay hidden class added on close button.");
    });

    shareFortuneButton.addEventListener('click', () => {
        console.log("script.js: Share fortune button clicked.");
        const text = `寄居城北占〜いで今日の運勢を占ったら「${currentFortuneType}」でした！あなたも占ってみよう！`;
        const url = encodeURIComponent(window.location.href);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}&hashtags=寄居城北占い`;
        window.open(twitterUrl, '_blank');
    });

    // 漢字一文字占い
    let lastCharacterDrawTime = 0;

    drawCharacterButton.addEventListener('click', () => {
        console.log("script.js: Draw character button clicked.");
        const currentTime = Date.now();
        characterMessageElement.textContent = "";
        characterResultDiv.classList.add('hidden');
        confettiContainer.innerHTML = '';

        if (lastCharacterDrawTime && (currentTime - lastCharacterDrawTime) < 180000) {
            characterMessageElement.textContent = "次の占いは3分後に引けます。少し休憩しましょう！";
            console.log("script.js: Cooldown active for character fortune.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * oneCharacterFortunes.length);
        const selectedFortune = oneCharacterFortunes[randomIndex];

        drawnCharacterElement.textContent = selectedFortune.char;
        characterDescriptionElement.textContent = selectedFortune.desc;
        
        characterResultDiv.classList.remove('hidden');
        generateConfetti();
        lastCharacterDrawTime = currentTime;
        console.log("script.js: Character fortune displayed.");
    });

    // 札引き占い
    let cardsDrawn = false;
    let lastCardDrawTime = 0;

    function initializeCards() {
        console.log("script.js: Initializing cards.");
        cardGrid.innerHTML = '';
        cardResultDiv.classList.add('hidden');
        resetCardsButton.classList.add('hidden');
        cardDrawMessageElement.textContent = '好きな札を1枚引いてください。';
        cardsDrawn = false;
        confettiContainer.innerHTML = '';

        const cardIcons = ['🏯', '🌸', '✨', '🍀', '🌈', '🎐', '🏮', '🔥', '🌊', '🌳'];

        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = i;
            
            const iconElement = document.createElement('span');
            iconElement.classList.add('card-icon');
            iconElement.textContent = cardIcons[Math.floor(Math.random() * cardIcons.length)];
            card.appendChild(iconElement);

            cardGrid.appendChild(card);

            card.addEventListener('click', () => {
                console.log("script.js: Card clicked.");
                const currentTime = Date.now();
                if (lastCardDrawTime && (currentTime - lastCardDrawTime) < 180000) {
                    cardDrawMessageElement.textContent = "次の占いは3分後に引けます。少し休憩しましょう！";
                    console.log("script.js: Cooldown active for card draw.");
                    return; 
                }

                if (!cardsDrawn) {
                    drawCard(card);
                    cardsDrawn = true;
                    lastCardDrawTime = currentTime;
                }
            });
        }
    }

    function drawCard(selectedCard) {
        console.log("script.js: Drawing card.");
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.add('disabled');
            card.style.cursor = 'default';
        });

        selectedCard.classList.add('revealed');
        selectedCard.querySelector('.card-icon').style.opacity = '0';

        setTimeout(() => {
            const randomFortune = cardFortunes[Math.floor(Math.random() * cardFortunes.length)];
            drawnCardFortuneElement.textContent = randomFortune;
            cardResultDiv.classList.remove('hidden');
            resetCardsButton.classList.remove('hidden');
            generateConfetti();
            cardDrawMessageElement.textContent = '';
            console.log("script.js: Card fortune displayed.");
        }, 500);
    }

    resetCardsButton.addEventListener('click', () => {
        console.log("script.js: Reset cards button clicked.");
        initializeCards();
    });


    // luckyNumberInput が確実に定義された後になるようにする
    if (luckyNumberInput) { // luckyNumberInputが存在するか確認
        // luckyNumberInput.readOnly = true; // 必要であればコメント解除

        numpadKeys.forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.dataset.value;
                let currentValue = luckyNumberInput.value;

                if (keyValue === 'C') { // クリアボタン
                    luckyNumberInput.value = '';
                    messageElement.textContent = ''; // エラーメッセージもクリア
                } else if (keyValue === 'DEL') { // 削除ボタン
                    luckyNumberInput.value = currentValue.slice(0, -1);
                } else { // 数字キー
                    // 既に1000以上の数字が入力されている、または4桁以上になる場合は追加しない
                    if (currentValue.length >= 4 && parseInt(currentValue + keyValue) > 1000) {
                        if (currentValue === '100' && keyValue === '0') { // 1000丁度になる場合
                            luckyNumberInput.value = currentValue + keyValue;
                        } else {
                            messageElement.textContent = "1000を超える数字は入力できません。";
                            return; // 追加しない
                        }
                    } else if (currentValue.length >= 4) { // 既に4桁で1000以下の場合（例: 0123）
                        messageElement.textContent = "最大4桁まで入力できます。";
                        return;
                    }
                    luckyNumberInput.value = currentValue + keyValue;
                    messageElement.textContent = ''; // 入力があればエラーメッセージをクリア
                }

                // 入力値が1000を超えた場合の最終チェック
                if (parseInt(luckyNumberInput.value) > 1000) {
                    luckyNumberInput.value = luckyNumberInput.value.slice(0, -1); // 最後の文字を削除
                    messageElement.textContent = "1000を超える数字は入力できません。";
                } else if (luckyNumberInput.value.length > 0 && parseInt(luckyNumberInput.value) < 1) {
                    luckyNumberInput.value = ''; // クリアする
                    messageElement.textContent = "1から1000までの数字を入力してください。";
                } else if (luckyNumberInput.value === "0") {
                    luckyNumberInput.value = "";
                    messageElement.textContent = "1から1000までの数字を入力してください。";
                }
            });
        });

        // luckyNumberInput の `input` イベントでもバリデーションを行う
        luckyNumberInput.addEventListener('input', () => {
            let val = luckyNumberInput.value;
            // 先頭の0を削除（例: "05" -> "5"）
            if (val.length > 1 && val.startsWith('0')) {
                val = parseInt(val, 10).toString(); // "012" -> "12"
                luckyNumberInput.value = val;
            }
            const num = parseInt(val);
            if (isNaN(num) || num < 1 || num > 1000) {
                messageElement.textContent = "1から1000までの数字を入力してください。";
            } else {
                messageElement.textContent = "";
            }
        });
    }
    
});

