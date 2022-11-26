import { view } from "./view.js";

// iframes

export const iframes = (_fetch) => view.get("data/iframes.json", (data) => {

    let template = [];

    for (let i = 0; i < data.length; i++) 
    {
        template.push(`
            <div class="modal fade" id="${data[i].name}" data-easein=""">
                <div class="modal-dialog modal-dialog-ease modal-lg ">
                    <div class="modal-content modal-content-dragabble">
                        <div class="modal-header">
                            <h5 class="modal-title">${data[i].title}</h5>
                            <button type="button" class="close" data-dismiss="modal"><i class="fas fa-times-circle"></i></button>
                        </div>
                        <div class="modal-body">
                            <div class="iframe_page">
                                <iframe src="${data[i].link}" frameborder="0" referrerpolicy="no-referrer"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    
    $('#iframes').html(template.join(''));
    return template;
    
},_fetch);

// Version

export const version = (_fetch) => view.get("data/version.json", (data) => {

    let template = [];

    template.push(`${data.version}`);

    console.log('Version: ',template)

    document.getElementById("version").innerHTML = template.join();
    return template;

},_fetch);