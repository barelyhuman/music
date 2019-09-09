var axios = require('axios');
var debounce = require('lodash/fp/debounce');

<searchbar>
    <input type="text" onkeyup={apiCall} placeholder="Search Here"> 

    <div>
    
    </div>
    
    const API = 'https://orion-server.herokuapp.com/api';

    searchTermChanged(event){
        if(event.target.value.length<3){
            return;
        }

        const url = API+'/search?searchTerm='+event.target.value

        axios.get(url)
        .then(data=>{
            opts.updatedatalist(data.data)
        })

    }

    this.apiCall = debounce(250)(this.searchTermChanged)


</searchbar>