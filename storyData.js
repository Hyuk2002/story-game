// 초기 사용자 상태 (첫 번째 로드 시 사용됨)
const initialUserState = {
    userId: 'player-a',
    username: '생존자 A',
    health: 100, // 체력: 100%
    inventory: ['손전등', '낡은 칼'], // 인벤토리
    currentSceneId: 'start',
    reputation: 50, // 평판: 50
    morality: 50, // 도덕성: 50
    dangerLevel: 0, // 위험도: 0
    PTSDLevel: 0 // PTSD 수치: 0
};


// 전체 장면 데이터
const allScenes = [
    {
        sceneId: 'start',
        title: '황량한 주유소, 마지막 순간',

        // ✔ 네가 가진 실제 이미지 경로 (폴더 구조 그대로 적용)
        imageUrl: 'images/gas.jpg',

        description: 
`해가 지기 시작한 황량한 미국 서부의 주유소. 당신은 연료를 찾기 위해 이곳에 멈췄습니다.
주유기 근처에서 주유소 직원 '샘(Sam)'을 만났지만, 대화 도중 **좀비 하나**가 갑자기 달려와 샘의 팔을 물고 사라졌습니다.
샘은 고통에 떨며 무너져 내립니다. 그는 곧 변할 것입니다.

어둠이 내리기 시작했고, 곧 더 많은 좀비 떼가 몰려올 수 있습니다. 당신의 트럭은 10미터 거리에 있습니다.`,
        choices: [
            { choiceText: '1. 샘을 버리고 트럭에 올라타 즉시 도망친다.', nextSceneId: 'S1_EgoRun' },
            { choiceText: '2. 샘을 트럭에 태워 가장 가까운 은신처로 함께 이동한다.', nextSceneId: 'S1_TakeSam' },
            { choiceText: '3. 샘이 좀비가 되기 전에 고통을 끝내준다. (안락사)', nextSceneId: 'S1_Euthanasia' }
        ]
    },

    {
        sceneId: 'S1_EgoRun',
        title: '비정한 출발',
        imageUrl: '',
        description: '당신은 샘의 절규를 뒤로하고 트럭에 올라탔습니다. 엑셀을 밟아 주유소를 빠져나왔습니다. 당신의 생존 본능은 만족했지만, 인간적인 감정은 상처를 입었습니다. 이제 다음 목적지를 찾아야 합니다.',
        choices: [
            { choiceText: '1. 주립 공원 방향으로 계속 운전한다.', nextSceneId: 'S2_Park' },
            { choiceText: '2. 고속도로를 피해 낡은 비포장 도로로 들어선다.', nextSceneId: 'S2_DirtRoad' }
        ]
    },

    {
        sceneId: 'S1_TakeSam',
        title: '불확실한 동행',
        imageUrl: '',
        description: '당신은 샘을 트럭 뒷좌석에 태웠습니다. 그의 고통스러운 신음 소리가 당신의 마음을 무겁게 합니다. 근처에 버려진 농가가 보입니다. 샘이 완전히 변하기 전에 그를 격리할 수 있는 곳을 찾아야 합니다.',
        choices: [
            { choiceText: '1. 농가에 들어가 샘을 묶고 치료법을 찾아본다.', nextSceneId: 'S2_FarmTreat' },
            { choiceText: '2. 샘에게 진통제를 먹이고 최대한 멀리 운전한다.', nextSceneId: 'S2_DriveFar' }
        ]
    },

    {
        sceneId: 'S1_Euthanasia',
        title: '어쩔 수 없는 선택',
        imageUrl: '',
        description: '당신은 낡은 칼을 꺼내어 고통스러워하는 샘의 목숨을 끊어주었습니다. 당신은 떨리는 손으로 그의 시체를 주유소 뒤편에 묻었습니다. 이제 트럭에 올라타야 합니다. 정신적인 충격이 큽니다.',
        choices: [
            { choiceText: '1. 최대한 빨리 이 지역을 벗어난다.', nextSceneId: 'S2_Escape' },
            { choiceText: '2. 주유소 건물을 잠시 수색하여 필요한 물품을 찾아본다.', nextSceneId: 'S2_Loot' }
        ]
    },

    // 다음 챕터를 위한 임시 장면들
    {
        sceneId: 'S2_Park',
        title: '깊은 숲 속',
        imageUrl: '',
        description: '주립 공원은 좀비의 침입이 덜한 것 같습니다. 하지만 길을 잃을 위험이 있습니다.',
        choices: [
            { choiceText: '1. 계속 전진', nextSceneId: 'start' } 
        ]
    },
    {
        sceneId: 'S2_DirtRoad',
        title: '낡은 비포장 도로',
        imageUrl: '',
        description: '비포장 도로를 따라가니 오래된 캠프장이 나타났습니다.',
        choices: [
            { choiceText: '1. 계속 전진', nextSceneId: 'start' } 
        ]
    },
    {
        sceneId: 'S2_FarmTreat',
        title: '버려진 농가',
        imageUrl: '',
        description: '농가에 도착했습니다. 샘의 상태가 급격히 나빠지고 있습니다.',
        choices: [
            { choiceText: '1. 계속 전진', nextSceneId: 'start' } 
        ]
    }
];

// 서버에서 사용하도록 export
module.exports = {
    initialUserState,
    allScenes
};
