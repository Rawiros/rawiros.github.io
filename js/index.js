const ProjectsList = document.querySelector("div.projects-list");
var debug = {
    log: (...args) => console.log("%cDebug%c", "color:#0984e3", "color:unset", ...args)
};

/**
 * Material Icons - Icon Dom
 * @param {String} name Icon Name 
 */
 function Icon(name){
    const i = document.createElement("i");
    i.classList.add("material-icons");
    i.innerText = name;
    return i;
};

class CardProject {

    /**
     * Create Card With Project Info
     * @param {{author: String, description: String|null, name: String, urls: Array<{name: String, href: String, color: ("default")}>}} Project
     */
    constructor(Project){
        const Row = document.createElement("div");
        const Column = document.createElement("div");
        const Card = document.createElement("div");
        const CardContent = document.createElement("div");
        const CardActions = document.createElement("div");
        const CardTitle = document.createElement("span");

        debug.log("CardProject", Project);
        
        /**
         * @param {String} icon 
         * @param {String} text 
         */
        function ItemContent(icon, text){
            text = new String(text);
            const pText = document.createElement("p");
            // pText.appendChild(Icon(icon));
            pText.innerHTML += text[0].toUpperCase() + text.slice(1);
            return pText;
        };

        // Set Row class
        Row.classList.add("row");

        // Set Card Content Class
        CardContent.classList.add("card-content");
        
        // Set Column Classes and width
        Column.classList.add("col", "s1", "m4");
        Column.style.width = "100%";

        // Set Card Classes
        Card.classList.add("card", "grey", "darken-4");

        // Set Card Title Class
        CardTitle.classList.add("card-title");

        // Set Card Actions Class
        CardActions.classList.add("card-action");

        // Set Card Content
        CardTitle.innerText = Project.name;
        // CardContent.appendChild(ItemContent("local_offer", Project.name??"None"));
        // CardContent.appendChild(ItemContent("person", Project.author??"Rawir"));
        CardContent.appendChild(CardTitle);
        
        if(typeof(Project.description) == 'string' && Project.description.length >= 1) {
            CardContent.appendChild(ItemContent("description", Project.description));
        };

        
        Card.appendChild(CardContent);
        if(!Project.urls) Project.urls = [];
        Project.urls.push({ color: "#0984e3", name: "Github", href: Project.html_url })
        
        // Set Card Actions
        if(Array.isArray(Project.urls) && Project.urls.length != 0) {
            Project.urls.forEach(url => {
                const Link = document.createElement("a");
                Link.setAttribute("href", url.href);
                Link.innerText = url.name;
                
                if(url.color && url.color != "default") {
                    Link.style.color =  url.color;
                };

                CardActions.appendChild(Link);
            });

            Card.appendChild(CardActions);
        };


        Column.appendChild(Card);
        Row.appendChild(Column);

        return Row;        
    }
};

document.addEventListener('DOMContentLoaded', () => {
    M.AutoInit(document.querySelector("#app"));
    debug.log("DOMContentLoaded");
    
    document.querySelector("div.fixed-action-btn > a").click()
});

function FetchFailed(){
    debug.log("Fetch Failed");
    M.toast({html: 'Downloading Projects List Failed', displayLength: 1500, inDuration: 400, classes: "red darken-4"});
};

fetch('https://api.github.com/users/Rawiros/repos')
.then(async res => {
    if(!res.ok) return FetchFailed();
    
    debug.log("Got repos list!");
    var Projects = await res.json();
    Projects.filter(project => !(new String(project.description).includes("!include"))).forEach(project => ProjectsList.appendChild(new CardProject(project)));
});
