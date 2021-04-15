let photoElement = document.querySelector("#profile_photo")


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