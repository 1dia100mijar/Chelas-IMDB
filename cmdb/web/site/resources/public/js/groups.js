function registerDeleteGroups(tokenClient) {
    const buttons = document.querySelectorAll('.deleteGroups')          //selecionar pela class

    buttons.forEach((button) => {
        button.addEventListener("click", async function(e) {
            const groupId = e.target.id
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
        });
    })
}
