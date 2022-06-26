var DOM = {
    Projects: document.querySelector("div.projects-list")
};

var debug = (...args) => console.log("%cDebug%c", "color:#0984e3", "color:unset", ...args);
var WSPORT = 9842;

// Class CardProject
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

        debug("CardProject", Project);
        
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
        CardContent.appendChild(CardTitle);
        
        if(typeof(Project.description) == 'string' && Project.description.length >= 1) {
            CardContent.appendChild(ItemContent("description", Project.description));
        };

        
        Card.appendChild(CardContent);
        if(!Project.urls) {
            Project.urls = [];
        };

        if(Project.html_url) {
            Project.urls.push({ color: "#0984e3", name: "Github", href: Project.html_url })
        }
        
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

// Auto init materialize etc.
addEventListener("DOMContentLoaded", function(){

    if(location.pathname == "/") {
        var DaysToBirthday = daysTo(new Date(2007, 7, 11));
    
        // get years in fandom
        var FandomJoined = YearDifference(new Date(2021, 1, 2), new Date())
        var FandomYearType = Math.floor(FandomJoined) <= 1 ? "year" : "years";
    
        // add values
        document.querySelector("info[icon=pets]").innerText += " " + FandomJoined.toFixed(1) + " " + FandomYearType;
        document.querySelector("info[icon=event]").innerText += getAge(new Date(2007, 7, 11)) + " — " + DaysToBirthday + " days to birthday"
    };


    Array.from(document.querySelectorAll("info[icon][tooltip][name]"))
        .forEach(InfoElement => {
            var p = document.createElement("p");
            var i = document.createElement("i");
            i.classList.add("small",  "inline-icon", "material-icons", "tooltipped");
            i.setAttribute("data-position", "left");
            i.setAttribute("data-tooltip", InfoElement.getAttribute("tooltip"));
            i.innerText = InfoElement.getAttribute("icon");
    
            p.innerHTML += "<strong>" + InfoElement.getAttribute("name") + ":  </strong>" + InfoElement.innerHTML;
    
            p.insertBefore(i, p.querySelector("strong"));
            InfoElement.parentElement.appendChild(p);
            InfoElement.remove();
            debug("Create Element", p);
        });

    M.AutoInit();
    
    debug("DOMContentLoaded");
});

// Show error toast
function ShowError(err){
    M.toast({
        html: "Error: " + err,
        displayLength: 1500,
        inDuration: 650,
        classes: "red darken-4"
    })
};

/**
 * https://stackoverflow.com/a/21090613/16329529
 * @param {Date} date 
 */
function daysTo(date) {
    var Today = new Date();
    date.setFullYear(Today.getFullYear());
    if(Today > date) {
        date.setFullYear(Today.getFullYear() + 1);
    };

    // Return days
    return Math.floor((date - Today) / (1000*60*60*24))
};

/**
 * @param {Date} date Birthday Date
 */
function getAge(date){
    var Today = new Date();
    var Age = Today.getFullYear() - date.getFullYear()
    var Month = Today.getMonth() - date.getMonth();

    if(Month < 0 || Month == 0 && Today.getDate() < Today.getDate()) {
        Age--;
    };

    return Age;
};


/**
 * https://stackoverflow.com/a/57030608/16329529
 * Stackoverflow because lazy asf
 * @param {Date} olddate 
 * @param {Date} newdate 
 */
function YearDifference(olddate, newdate) {
    var new_y = newdate.getFullYear();
    var old_y = olddate.getFullYear();
    var diff_y = new_y - old_y;
    var start_year = new Date(olddate);
    var end_year = new Date(olddate);
    start_year.setFullYear(new_y);
    end_year.setFullYear(new_y+1);
    if (start_year > newdate) {
      start_year.setFullYear(new_y-1);
      end_year.setFullYear(new_y);
      diff_y--;
    }
    var diff = diff_y + (newdate - start_year)/(end_year - start_year);
    return diff;
}

// Do request to github api
fetch("https://api.github.com/users/Rawiros/repos")
    .then(async response => {

        if(!response.ok) {
            var code = "HTTP_CODE_" + response.status;

            debug(code)
            ShowError(code);
            return;
        };

        var Projects = await response.json();
        debug("Projects", Projects);

        Projects
        .filter(Project => [...Project.topics].includes("page-include"))
        .forEach(Project => DOM.Projects.appendChild(new CardProject(Project)));

}).catch(err => debug(err));

