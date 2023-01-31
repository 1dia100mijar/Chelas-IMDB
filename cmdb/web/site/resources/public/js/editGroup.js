function registerDelete(tokenClient, groupId) {
    const buttonUpdate = document.querySelector("#updateGroup")         //selecionar pelo id
    buttonUpdate.onclick = handleClickUpdateGroup
    

    async function handleClickUpdateGroup() {
        const title = document.querySelector("#title").value
        const description = document.querySelector("#description").value

        const uri = `http://localhost:1350/api/groups/${groupId}`
        const options = { 
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${tokenClient}`,
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                "title": title,
                "description": description,
            })
        }
        
        const rsp = await fetch(uri,  options)
        if(rsp.ok) {
            window.location = `/groups/${groupId}`
        }
    }
}

