let isVideo = false;
const ancho_slider = document.querySelector(".over").getBoundingClientRect().width

document.addEventListener("click", (e) => {

    if(e.target.id == "right"){

        document.querySelector(".over").scrollLeft += ancho_slider
    }
    
    if(e.target.id == "left"){
        
        
        document.querySelector(".over").scrollLeft -= ancho_slider
    }

    if(e.target.className == "cc"){
        let search = e.target.id;
        insert_all(search)
    }

    if(e.target.id == "search"){
        let search = document.querySelector("#input").value;
        insert_all(search)
    }
})


const inser_first_video = (id, title) => {

    document.querySelector("#first_video").src = `https://www.youtube.com/embed/${id}`
    document.querySelector(".video_title").innerHTML = title
}

const null_video = () =>{

    if(isVideo == true){
        document.querySelector(".no").style.display = "none";
    }
}

const insert_video_relation = async(id) => {

    const url = `https://youtube138.p.rapidapi.com/video/related-contents/?id=${id}&hl=en&gl=US`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6540e9183cmshf6a5ae7b5a14b33p1f6b62jsn844444534f85',
            'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    const result = await response.json();
    let insertado = 0;
    document.querySelector(".over").innerHTML = "";

    while(insertado <= 10){
        
        if(result.contents[insertado]["type"] == "video"){

            document.querySelector(".over").innerHTML += `
            
                <div>
                    <img id="${result.contents[insertado]["video"]["title"]}" class="cc" src=${result.contents[insertado]["video"]["thumbnails"][0]["url"]} />
                </div>
            `;
        }
        insertado++;
    }

}

const insert_all = (search) => {
    isVideo = true
    loader();

    (async() => {

        const url= `https://youtube138.p.rapidapi.com/search/?q=${search}&hl=en&gl=US`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '6540e9183cmshf6a5ae7b5a14b33p1f6b62jsn844444534f85',
                'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();
        const first = !(result.contents[0].video) ? result.contents[1].video : result.contents[0].video;
        document.querySelector(".text_description").innerHTML = first["descriptionSnippet"]
        document.querySelector("#img_chanel").src = first["author"]["avatar"][0]["url"]
        document.querySelector("#title_chanel").innerHTML = first["author"]["title"]
        console.log(result);

        inser_first_video(first.videoId, first.title)
        insert_comments(first.videoId)
        insert_video_relation(first.videoId)

    })()

    null_video()
}

const loader = () => {

    document.querySelector(".carga").style.display = "flex";

    setTimeout(() => {

        document.querySelector(".carga").style.display = "none";
    }, 4000);
}

const insert_comments = async(id) => {
    document.querySelector(".content_comentarios").innerHTML = "";
    const url = `https://youtube138.p.rapidapi.com/video/comments/?id=${id}&hl=en&gl=US`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6540e9183cmshf6a5ae7b5a14b33p1f6b62jsn844444534f85',
            'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    const result = await response.json();

    for (let i = 0; i < 3; i++) {
        
        document.querySelector(".content_comentarios").innerHTML += `
    
        <div>
            <h3 id="nombre_user" style="margin: 20px 0 20px 0;">${result.comments[i]["author"]["title"]}</h3>
            <p id="comment_user">${result.comments[i]["content"]}</p>
            <p><b id="time_user">${result.comments[i]["publishedTimeText"]}</b></p>
        </div>
        
        `
    }

}