function registerDelete(tokenClient) {
    const groupId = window.location.pathname.split('/').pop()

    const buttonDeleteGroup = document.querySelector("#deleteGroup")       //selecionar pelo id
    buttonDeleteGroup.onclick = handleClickDeleteGroup

    const deleteMovieButtons = document.querySelectorAll(".deleteMovie")       //selecionar pelo class
    deleteMovieButtons.forEach(button => button.addEventListener("click", _ => handleClickDeleteMovie(button)))

    async function handleClickDeleteGroup() {
        const uriDelete = `/api/groups/${groupId}`
        const options = { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenClient}`
            }
        }
        const rsp = await fetch(uriDelete,  options)
        if(rsp.ok) {
            window.location = '/groups'
        }
    }

    async function handleClickDeleteMovie(button) {
        const movieId = button.id
        const uriDelete = `/api/groups/movies/${groupId}`
        const options = { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenClient}`,
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                "movieId": movieId,
            })
        }
        const rsp = await fetch(uriDelete,  options)
        if(rsp.ok) {
            window.location = `/groups/${groupId}`
        }
    }
}

