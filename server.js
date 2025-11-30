// server.js (Express 서버)

// 1. 라이브러리 가져오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { initialUserState, allScenes } = require('./storyData');

const app = express();
const PORT = 8080;

// 2. MongoDB URI
const MONGO_URI = 'mongodb+srv://Hyuk_db:L2l9jioMeni0G9Yo@hyuk2002.raamq9w.mongodb.net/?retryWrites=true&w=majority&appName=Hyuk2002';

// 3. 미들웨어
app.use(cors());
app.use(express.json());

// 🔥🔥🔥 핵심: images 폴더 정적 경로로 열기
app.use('/images', express.static(path.join(__dirname, 'images')));

// 4. DB 모델 설정
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    health: { type: Number, default: 100 },
    inventory: [{ type: String }],
    currentSceneId: { type: String, default: 'start' },
    reputation: { type: Number, default: 50 },
    morality: { type: Number, default: 50 },
    dangerLevel: { type: Number, default: 0 },
    PTSDLevel: { type: Number, default: 0 }
});

const sceneSchema = new mongoose.Schema({
    sceneId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    imageUrl: { type: String },
    description: { type: String, required: true },
    choices: [{
        choiceText: { type: String, required: true },
        nextSceneId: { type: String, required: true }
    }]
});

const User = mongoose.model('User', userSchema);
const Scene = mongoose.model('Scene', sceneSchema);

// 5. 초기 스토리 삽입 함수
async function initializeScenes() {
    await Scene.deleteMany({});

    let count = 0;
    for (const sceneData of allScenes) {
        try {
            const newScene = new Scene(sceneData);
            await newScene.save();
            count++;
        } catch (err) {
            console.error(`Scene insert error (${sceneData.sceneId}):`, err);
        }
    }

    console.log(`📚 ${count}개의 장면이 DB에 삽입되었습니다.`);
}

// 6. DB 연결 후 초기화
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🟢 MongoDB 연결 성공");
        await initializeScenes();
    } catch (err) {
        console.error("🔴 MongoDB 연결 실패:", err);
    }
}
connectDB();

// ----------------------------------------------------
// 🔥 7. index.html 파일 서빙 (경로 및 절대 경로 안정성 강화)
// ----------------------------------------------------
app.get('/', (req, res) => {
    // index.html이 server.js와 같은 폴더에 있다고 가정하고 path.join 사용 (기존 코드가 이 코드를 원함)
    // 만약 index.html이 'public' 폴더 안에 있다면, path.join(__dirname, 'public', 'index.html')로 변경해야 합니다.
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// ----------------------------------------------------
// 🔥 8. API: 게임 시작
// ----------------------------------------------------
app.get('/api/game/start', async (req, res) => {
    try {
        const sceneData = await Scene.findOne({ sceneId: 'start' });

        if (!sceneData) {
            return res.status(404).json({ success: false, message: "Initial scene not found." });
        }

        res.status(200).json({
            success: true,
            userState: initialUserState,
            sceneData
        });

    } catch (err) {
        console.error("Start API error:", err);
        res.status(500).json({ success: false });
    }
});

// ----------------------------------------------------
// 🔥 9. API: 게임 선택 이동
// ----------------------------------------------------
app.post('/api/game/move', async (req, res) => {
    const { nextSceneId, currentSceneId } = req.body;

    if (!nextSceneId) {
        return res.status(400).json({ success: false, message: "nextSceneId is required." });
    }

    try {
        const nextScene = await Scene.findOne({ sceneId: nextSceneId });

        if (!nextScene) {
            return res.status(404).json({ success: false, message: "Scene not found." });
        }

        let updatedUserState = { ...initialUserState, currentSceneId: nextSceneId };

        // 선택에 따른 스탯 변화
        if (currentSceneId === 'start') {
            if (nextSceneId === 'S1_EgoRun') {
                updatedUserState.reputation -= 10;
                updatedUserState.morality -= 5;
            } else if (nextSceneId === 'S1_TakeSam') {
                updatedUserState.reputation += 5;
                updatedUserState.morality += 5;
                updatedUserState.dangerLevel += 10;
            } else if (nextSceneId === 'S1_Euthanasia') {
                updatedUserState.morality -= 5;
                updatedUserState.PTSDLevel += 5;
            }
        }

        res.status(200).json({
            success: true,
            userState: updatedUserState,
            sceneData: nextScene
        });

    } catch (err) {
        console.error("Move API error:", err);
        res.status(500).json({ success: false });
    }
});

// ----------------------------------------------------
// 10. 서버 시작 (외부 접속을 위한 '0.0.0.0' 바인딩 필수 적용)
// ----------------------------------------------------
const HOST = '0.0.0.0'; // 외부 접속 (ngrok)을 허용하기 위해 모든 IP에 바인딩
app.listen(PORT, HOST, () => {
    console.log(`✅ 서버 실행 중: http://${HOST}:${PORT}`);
});