let photoElement = document.querySelector("#profile_photo")
let followButton = document.querySelector("#follow_button") || document.createElement('button')
let followersButton = document.querySelector("#followersButton")

photoElement.addEventListener('change', async (evt) => {
    if(evt.target.files.length){
        let formdata = new FormData()
        formdata.append('photo', evt.target.files[0])
        let response = await fetch('profile/photo', {
            method: "POST",
            body: formdata
        })
        response = await response.json()
        if(response.ok){
            window.location.reload()
        } else {
            alert("Error")
        }
    }
})


followButton.addEventListener('click', async event => {
    let username = event.target.getAttribute('data-username')
    try {
        let response = await fetch('./follow', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        })
        response = await response.json()

        if(response.ok){
            event.target.classList.toggle('btn-primary')
            event.target.classList.toggle('btn-secondary')
            response.followOld ? event.target.textContent = "Follow" : event.target.textContent = "Unfollow"
        } else {
            alert("error")
        }
    }
    catch(e){

    }
})



followersButton.addEventListener('click', async event => {
    const username = event.target.getAttribute('data-username')
    console.log(username);

    try {
        let response = await fetch('./followers?' + 'username=' + username)
        response = await response.json()
        console.log(response);
    }
    catch(e){

    }
})