// Reviewed starter interface strings. Remaining locales intentionally fall back to zh-TW.
export const messages={
'zh-TW':{heroTitle:'從零開始，學會臺灣華語',heroDesc:'從發音到日常生活，一步一步練習。',start:'開始第一課 →',topics:'中文學習知識地圖',lesson:'第一課｜生活問候',resources:'官方學習資源',search:'搜尋資源',notice:'目前顯示繁體中文。'},
en:{heroTitle:'Learn Mandarin for life in Taiwan',heroDesc:'Practice pronunciation, characters, and everyday conversations step by step.',start:'Start lesson one →',topics:'Chinese learning roadmap',lesson:'Lesson 1 | Everyday greetings',resources:'Official learning resources',search:'Search resources',notice:'English interface labels are available. Lesson explanations are still in Traditional Chinese.'},
vi:{heroTitle:'Học tiếng Hoa dùng tại Đài Loan',heroDesc:'Từng bước luyện phát âm, chữ Hán và giao tiếp hằng ngày.',start:'Bắt đầu bài học đầu tiên →',topics:'Lộ trình học tiếng Hoa',lesson:'Bài 1 | Chào hỏi hằng ngày',resources:'Tài nguyên học tập chính thức',search:'Tìm tài nguyên',notice:'Một số mục giao diện đã có tiếng Việt; phần giải thích bài học vẫn bằng tiếng Hoa phồn thể.'},
id:{heroTitle:'Belajar bahasa Mandarin untuk kehidupan di Taiwan',heroDesc:'Pelajari pelafalan, aksara Han, dan percakapan sehari-hari secara bertahap.',start:'Mulai pelajaran pertama →',topics:'Peta pembelajaran bahasa Mandarin',lesson:'Pelajaran 1 | Salam sehari-hari',resources:'Sumber belajar resmi',search:'Cari sumber belajar',notice:'Sebagian antarmuka tersedia dalam bahasa Indonesia; penjelasan pelajaran masih dalam bahasa Mandarin Tradisional.'}
};
export function localeMessages(code){return messages[code]??messages['zh-TW'];}
export function isLocalized(code){return Object.hasOwn(messages,code);}
