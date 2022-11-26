import { view } from "./view.js";

const forms = {};

forms.contact = (args) => {

    let form = args.form;
    let http = args._fetch ?? fetch;

    view.get('https://api.ipify.org/?format=json', (data) => {

        data = {
            'ip': data.ip,
            'site': form.site.value,
            'name': form.name.value,
            'address': form.address.value,
            'subject' : form.subject.value,
            'body' : form.body.value
        };

        http('https://pow2fta3w1.execute-api.us-east-1.amazonaws.com/production/contact', {
            method: 'POST',
            json: true,
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {

            let quotes = json.body;

            $('.contact-form .row, .contact-form .submit').css('display','none');
            $('.contact-form .response').html(quotes.replace(/\"/g, ""));
            $('.contact-form .response').css({ 'text-align':'center', 'display':'block', 'margin-top':'15px' });

        })
        .catch(error => error);

    }, http, true);

    return true;

};

forms.newsletter = (args) => {

	let form = args.form;
	let http = args._fetch ?? fetch;
	  
	const data = {
		'site': form.site.value,
		'address': form.address.value
	};

	http('https://nyjv5cewj3.execute-api.us-east-1.amazonaws.com/production/newsletter', {
		method: 'POST',
		json: true,
		body: JSON.stringify(data),
		mode: 'cors',
		headers: {
			'Origin': '*',
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(json => {

		form.reset();

	})
	.catch(error => error);

    return true;

};

export { forms }