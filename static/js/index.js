document.addEventListener("DOMContentLoaded", () => {
    display_music("");  // ページ読み込み時に全曲表示
});

document.getElementById("search_btn").addEventListener("click", () => {
    const music_name = document.getElementById("music_input").value.trim();
    display_music(music_name);
});

async function display_music(music_name) {
    const searched_music = document.getElementById("searched_music");
    searched_music.innerHTML = "";

    try {
        const res = await fetch("/static/sound/song_list.json");
        const songList = await res.json();

        // 部分一致検索（タイトルのみ）
        let matchedSongs = [];
        if (music_name) {
            matchedSongs = songList.filter(
                s => s.title.trim().toLowerCase().includes(music_name.toLowerCase())
            );
        } else {
            matchedSongs = songList;  // 空なら全曲表示
        }

        if (matchedSongs.length > 0) {
            matchedSongs.forEach(song => {
                const song_div = document.createElement("div");
                song_div.className = "song_item";

                const text_div = document.createElement("div");
                text_div.textContent = `${song.title} / ${song.artist}`;

                const music_btn = document.createElement("button");
                music_btn.textContent = "選択";
                music_btn.addEventListener("click", () => {
                    location.href = `/sing?music_name=${encodeURIComponent(song.title)}`;
                });

                song_div.appendChild(text_div);
                song_div.appendChild(music_btn);

                searched_music.appendChild(song_div);
            });
        } else {
            const div = document.createElement("div");
            div.className = "no_song";
            div.textContent = "曲が登録されていません";
            searched_music.appendChild(div);
        }
    } catch (err) {
        console.error(err);
        const div = document.createElement("div");
        div.className = "no_song";
        div.textContent = "曲リストの読み込みに失敗しました";
        searched_music.appendChild(div);
    }
}